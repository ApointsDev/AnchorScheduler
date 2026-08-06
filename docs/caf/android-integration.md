# Android APP CAF 登录接入指南

本文档指导 Android 开发者如何在自己的 APP 中集成 AnchorCAF 登录。

## 1. 流程概述

```
┌──────────────────────────────────────────────────────────────┐
│ ① GET /api/auth/caf/authorize-url?platform=mobile             │
│    获取 CAF 授权 URL                                          │
├──────────────────────────────────────────────────────────────┤
│ ② 用 Chrome Custom Tabs 打开授权 URL                           │
│    用户在 CAF 页面完成授权                                      │
├──────────────────────────────────────────────────────────────┤
│ ③ CAF 回调 deep link: schedule.apoints://caf/callback?code=xxx│
│    Activity 拦截并解析 code                                    │
├──────────────────────────────────────────────────────────────┤
│ ④ POST /api/auth/caf/token { code: "xxx" }                   │
│    换取本系统 JWT                                              │
├──────────────────────────────────────────────────────────────┤
│ ⑤ 保存 JWT → 后续 API 请求携带 Authorization: Bearer <JWT>     │
└──────────────────────────────────────────────────────────────┘
```

## 2. 依赖配置

### build.gradle.kts (Module)

```kotlin
dependencies {
    // Chrome Custom Tabs - 用于在 APP 内打开 CAF 授权页
    implementation("androidx.browser:browser:1.7.0")

    // Retrofit + OkHttp - 网络请求
    implementation("com.squareup.retrofit2:retrofit:2.9.0")
    implementation("com.squareup.retrofit2:converter-gson:2.9.0")
    implementation("com.squareup.okhttp3:okhttp:4.12.0")
    implementation("com.squareup.okhttp3:logging-interceptor:4.12.0")

    // Gson
    implementation("com.google.code.gson:gson:2.10.1")

    // DataStore - 本地持久化 Token
    implementation("androidx.datastore:datastore-preferences:1.0.0")

    // Coroutines
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-android:1.7.3")
}
```

## 3. Deep Link 注册

### AndroidManifest.xml

在需要接收 CAF 回调的 Activity 中声明 intent-filter：

```xml
<activity
    android:name=".ui.caf.CafCallbackActivity"
    android:exported="true"
    android:launchMode="singleTask">

    <intent-filter>
        <action android:name="android.intent.action.VIEW" />
        <category android:name="android.intent.category.DEFAULT" />
        <category android:name="android.intent.category.BROWSABLE" />

        <!-- 自定义 scheme -->
        <data
            android:scheme="schedule.apoints"
            android:host="caf"
            android:path="/callback" />
    </intent-filter>
</activity>
```

> **注意**：default scheme 为 `schedule.apoints`，可在服务端通过 `CAF_MOBILE_REDIRECT_URI` 环境变量自定义。建议生产环境使用 HTTPS App Links 替代自定义 scheme 以提升安全性。

## 4. 网络层搭建

### 4.1 DTO 定义 (CafDtos.kt)

```kotlin
package com.example.app.data.dto

import com.google.gson.annotations.SerializedName

data class AuthorizeUrlResponse(
    @SerializedName("url") val url: String,
    @SerializedName("platform") val platform: String
)

data class CafTokenRequest(
    @SerializedName("code") val code: String
)

data class CafTokenResponse(
    @SerializedName("token") val token: String,
    @SerializedName("email") val email: String,
    @SerializedName("name") val name: String
)
```

### 4.2 API 接口定义 (CafApi.kt)

```kotlin
package com.example.app.data.api

import com.example.app.data.dto.AuthorizeUrlResponse
import com.example.app.data.dto.CafTokenRequest
import com.example.app.data.dto.CafTokenResponse
import retrofit2.http.*

interface CafApi {

    @GET("/api/auth/caf/authorize-url")
    suspend fun getAuthorizeUrl(
        @Query("platform") platform: String = "mobile"
    ): AuthorizeUrlResponse

    @POST("/api/auth/caf/token")
    suspend fun exchangeToken(
        @Body request: CafTokenRequest
    ): CafTokenResponse
}
```

### 4.3 Retrofit 实例 (NetworkModule.kt)

```kotlin
package com.example.app.data.api

import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import java.util.concurrent.TimeUnit

object ApiClient {

    // 生产环境替换为实际后端地址
    const val BASE_URL = "https://schedule.apoints.cn/"

    private val loggingInterceptor = HttpLoggingInterceptor().apply {
        level = if (BuildConfig.DEBUG)
            HttpLoggingInterceptor.Level.BODY
        else
            HttpLoggingInterceptor.Level.NONE
    }

    private val okHttpClient = OkHttpClient.Builder()
        .addInterceptor(loggingInterceptor)
        .connectTimeout(15, TimeUnit.SECONDS)
        .readTimeout(15, TimeUnit.SECONDS)
        .build()

    private val retrofit = Retrofit.Builder()
        .baseUrl(BASE_URL)
        .client(okHttpClient)
        .addConverterFactory(GsonConverterFactory.create())
        .build()

    val cafApi: CafApi = retrofit.create(CafApi::class.java)
}
```

## 5. Token 持久化 (AuthStore.kt)

```kotlin
package com.example.app.data.local

import android.content.Context
import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.Preferences
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.map

private val Context.dataStore: DataStore<Preferences> by preferencesDataStore(name = "auth")

class AuthStore(private val context: Context) {

    companion object {
        private val KEY_TOKEN = stringPreferencesKey("jwt_token")
        private val KEY_EMAIL = stringPreferencesKey("user_email")
        private val KEY_NAME = stringPreferencesKey("user_name")
    }

    val tokenFlow: Flow<String?> = context.dataStore.data.map { prefs ->
        prefs[KEY_TOKEN]
    }

    val emailFlow: Flow<String?> = context.dataStore.data.map { prefs ->
        prefs[KEY_EMAIL]
    }

    suspend fun getToken(): String? {
        return context.dataStore.data.first()[KEY_TOKEN]
    }

    suspend fun saveAuth(token: String, email: String, name: String) {
        context.dataStore.edit { prefs ->
            prefs[KEY_TOKEN] = token
            prefs[KEY_EMAIL] = email
            prefs[KEY_NAME] = name
        }
    }

    suspend fun clearAuth() {
        context.dataStore.edit { it.clear() }
    }
}
```

## 6. CAF 登录核心实现

### 6.1 ViewModel (CafLoginViewModel.kt)

```kotlin
package com.example.app.ui.caf

import android.app.Application
import android.content.Intent
import android.net.Uri
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.example.app.data.api.ApiClient
import com.example.app.data.dto.CafTokenRequest
import com.example.app.data.local.AuthStore
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

sealed class CafLoginState {
    data object Idle : CafLoginState()
    data object Loading : CafLoginState()
    data class AuthorizeUrlReady(val url: String) : CafLoginState()
    data class Success(val email: String, val name: String) : CafLoginState()
    data class Error(val message: String) : CafLoginState()
}

class CafLoginViewModel(application: Application) : AndroidViewModel(application) {

    private val authStore = AuthStore(application)

    private val _state = MutableStateFlow<CafLoginState>(CafLoginState.Idle)
    val state: StateFlow<CafLoginState> = _state.asStateFlow()

    /**
     * 第①步：获取 CAF 授权 URL
     * 调用后通过 state 拿到 url，由 Activity/Compose 打开 Chrome Custom Tabs
     */
    fun fetchAuthorizeUrl() {
        viewModelScope.launch {
            _state.value = CafLoginState.Loading
            try {
                val response = ApiClient.cafApi.getAuthorizeUrl("mobile")
                _state.value = CafLoginState.AuthorizeUrlReady(response.url)
            } catch (e: Exception) {
                _state.value = CafLoginState.Error(
                    e.message ?: "获取授权链接失败，请稍后重试"
                )
            }
        }
    }

    /**
     * 第④步：处理 deep link 回调中的 code，向服务端换取 JWT
     */
    fun exchangeCodeForToken(code: String) {
        viewModelScope.launch {
            _state.value = CafLoginState.Loading
            try {
                val response = ApiClient.cafApi.exchangeToken(CafTokenRequest(code))
                authStore.saveAuth(response.token, response.email, response.name)
                _state.value = CafLoginState.Success(response.email, response.name)
            } catch (e: Exception) {
                _state.value = CafLoginState.Error(
                    e.message ?: "CAF 登录失败，请稍后重试"
                )
            }
        }
    }

    /**
     * 处理 deep link intent，提取 code 参数
     * @return code 参数值，如果不是 CAF 回调则返回 null
     */
    fun extractCodeFromIntent(intent: Intent?): String? {
        val uri: Uri? = intent?.data ?: return null
        if (uri.scheme != "schedule.apoints") return null
        if (uri.host != "caf") return null
        return uri.getQueryParameter("code")
    }
}
```

### 6.2 回调 Activity (CafCallbackActivity.kt)

```kotlin
package com.example.app.ui.caf

import android.content.Intent
import android.net.Uri
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.viewModels
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

class CafCallbackActivity : ComponentActivity() {

    private val viewModel: CafLoginViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val code = viewModel.extractCodeFromIntent(intent)
        if (code != null) {
            viewModel.exchangeCodeForToken(code)
        }

        setContent {
            CafCallbackScreen(
                state = viewModel.state,
                onClose = { finish() }
            )
        }
    }

    override fun onNewIntent(intent: Intent) {
        super.onNewIntent(intent)
        val code = viewModel.extractCodeFromIntent(intent)
        if (code != null) {
            viewModel.exchangeCodeForToken(code)
        }
    }
}

@Composable
fun CafCallbackScreen(
    state: CafLoginState,
    onClose: () -> Unit
) {
    Surface(modifier = Modifier.fillMaxSize()) {
        when (state) {
            is CafLoginState.Loading -> {
                Box(
                    modifier = Modifier.fillMaxSize(),
                    contentAlignment = Alignment.Center
                ) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        CircularProgressIndicator()
                        Spacer(modifier = Modifier.height(16.dp))
                        Text("正在完成登录...")
                    }
                }
            }
            is CafLoginState.Success -> {
                LaunchedEffect(Unit) {
                    // 登录成功，跳转到主页
                    onClose()
                }
            }
            is CafLoginState.Error -> {
                Box(
                    modifier = Modifier.fillMaxSize(),
                    contentAlignment = Alignment.Center
                ) {
                    Column(
                        horizontalAlignment = Alignment.CenterHorizontally,
                        modifier = Modifier.padding(32.dp)
                    ) {
                        Text(
                            text = state.message,
                            color = MaterialTheme.colorScheme.error
                        )
                        Spacer(modifier = Modifier.height(16.dp))
                        Button(onClick = onClose) {
                            Text("返回")
                        }
                    }
                }
            }
            else -> { /* Idle */ }
        }
    }
}
```

### 6.3 登录页面触发 (LoginScreen.kt 关键代码)

```kotlin
import androidx.browser.customtabs.CustomTabsIntent

@Composable
fun CafLoginButton() {
    val context = LocalContext.current
    val viewModel: CafLoginViewModel = viewModel()
    val state by viewModel.state.collectAsState()

    // 监听授权 URL 就绪 → 打开 Chrome Custom Tabs
    LaunchedEffect(state) {
        if (state is CafLoginState.AuthorizeUrlReady) {
            val url = (state as CafLoginState.AuthorizeUrlReady).url
            CustomTabsIntent.Builder()
                .build()
                .launchUrl(context, Uri.parse(url))
        }
    }

    Button(
        onClick = { viewModel.fetchAuthorizeUrl() },
        enabled = state !is CafLoginState.Loading
    ) {
        if (state is CafLoginState.Loading) {
            CircularProgressIndicator(
                modifier = Modifier.size(20.dp),
                strokeWidth = 2.dp
            )
            Spacer(modifier = Modifier.width(8.dp))
        }
        Text("CAF 登录")
    }
}
```

## 7. 为所有 API 请求注入 Token

### 拦截器 (AuthInterceptor.kt)

```kotlin
package com.example.app.data.api

import com.example.app.data.local.AuthStore
import kotlinx.coroutines.runBlocking
import okhttp3.Interceptor
import okhttp3.Response

class AuthInterceptor(private val authStore: AuthStore) : Interceptor {

    override fun intercept(chain: Interceptor.Chain): Response {
        val token = runBlocking { authStore.getToken() }
        val request = if (token != null) {
            chain.request().newBuilder()
                .addHeader("Authorization", "Bearer $token")
                .build()
        } else {
            chain.request()
        }
        return chain.proceed(request)
    }
}
```

将拦截器加入 OkHttpClient：

```kotlin
private val okHttpClient = OkHttpClient.Builder()
    .addInterceptor(AuthInterceptor(authStore))
    .addInterceptor(loggingInterceptor)
    .connectTimeout(15, TimeUnit.SECONDS)
    .readTimeout(15, TimeUnit.SECONDS)
    .build()
```

## 8. 完整登录流程代码示例

```kotlin
// ============ 在 MainActivity 或导航宿主中 ============

class MainActivity : ComponentActivity() {

    private val viewModel: CafLoginViewModel by viewModels()
    private val authStore = AuthStore(this)

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // 如果 APP 是通过 deep link 打开的，处理回调
        val code = viewModel.extractCodeFromIntent(intent)
        if (code != null) {
            viewModel.exchangeCodeForToken(code)
        }

        setContent {
            val isLoggedIn by authStore.tokenFlow
                .map { it != null }
                .collectAsState(initial = false)

            if (isLoggedIn) {
                MainScreen()
            } else {
                LoginScreen()
            }
        }
    }
}
```

## 9. 错误处理参考

| HTTP 状态码 | 含义 | 处理建议 |
|------------|------|---------|
| 400 | 缺少 `code` 参数 | 检查 deep link 回调 URL 是否正确携带 code |
| 500 (CAF not ready) | CAF 服务未就绪 | 向用户提示「服务暂不可用」，稍后重试 |
| 500 (token exchange) | code 无效或已过期 | 提示用户重新授权（code 只能使用一次） |
| 500 (user identify) | 无法从 CAF token 中识别用户 | 提示用户联系管理员 |
| 网络超时 / DNS 解析失败 | 网络问题 | 提示检查网络连接后重试 |

## 10. 注意事项

1. **Chrome Custom Tabs 优于 WebView**：Custom Tabs 与用户浏览器共享 cookie，如果用户在 Chrome 中已登录 CAF，则无需重复登录。
2. **code 只能使用一次**：CAF 的 OAuth 授权码是一次性的，换取 JWT 后立即失效。重放会返回 500。
3. **Deep link 冲突处理**：如果多个 APP 注册了相同的 scheme，Android 会弹出选择框。建议生产环境升级为 [Android App Links](https://developer.android.com/training/app-links)（HTTPS 验证）。
4. **Token 存储安全**：Demo 中使用 DataStore 明文存储。生产环境建议使用 EncryptedSharedPreferences 或 Android Keystore。
5. **服务端配置**：确认服务端 `.env` 中 `CAF_SERVER_BASE_URL` 已正确配置，且 `CAF_MOBILE_REDIRECT_URI` 与 `AndroidManifest.xml` 中的 scheme/host/path 一致。

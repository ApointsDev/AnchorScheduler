import express from 'express';
import { AlgorithmService } from '../Services/Algorithms/AlgorithmService';
import { logger } from '../Utils/logger';
import { dbService } from '../Services/dbService';

export function initializeAlgorithmRoutes(authenticateToken: any) {
  const router = express.Router();
  const algorithmService = new AlgorithmService();

  // 个人日程优化
  router.post('/optimize-schedule', authenticateToken, async (req: any, res: any) => {
    try {
      const { tasks, fixedEvents, availableSlots, dependencies } = req.body;
      
      // Basic validation
      if (!tasks || !Array.isArray(tasks)) {
        return res.status(400).json({ error: 'Invalid tasks input' });
      }

      const result = await algorithmService.optimizePersonalSchedule(
        tasks, 
        fixedEvents || [], 
        availableSlots || [], 
        dependencies || []
      );
      
      // Convert Map to Object for JSON response
      const assignmentsObj = Object.fromEntries(result);
      
      res.json({ success: true, assignments: assignmentsObj });
    } catch (error: any) {
      logger.error('Optimize schedule failed:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // 团队会议安排
  router.post('/schedule-meeting', authenticateToken, async (req: any, res: any) => {
    try {
      const { teamMembers, requirements, weights } = req.body;
      
      if (!teamMembers || !requirements) {
        return res.status(400).json({ error: 'Missing required parameters' });
      }

      const result = await algorithmService.scheduleTeamMeeting(
        teamMembers,
        requirements,
        weights
      );

      // Convert Map to Object
      const adjustmentsObj = Object.fromEntries(result.adjustments);

      res.json({ 
        success: true, 
        result: {
          ...result,
          adjustments: adjustmentsObj
        }
      });
    } catch (error: any) {
      logger.error('Schedule meeting failed:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // 关键路径分析
  router.post('/critical-path', authenticateToken, async (req: any, res: any) => {
    try {
      const { tasks, startDate } = req.body;
      
      if (!tasks) {
        return res.status(400).json({ error: 'Missing tasks' });
      }

      const start = startDate ? new Date(startDate) : new Date();
      const result = algorithmService.analyzeProjectCriticalPath(tasks, start);

      // Convert Maps to Objects
      res.json({
        success: true,
        result: {
          criticalPath: result.criticalPath,
          projectDuration: result.projectDuration,
          slackTimes: Object.fromEntries(result.slackTimes),
          earliestStart: Object.fromEntries(result.earliestStart),
          latestStart: Object.fromEntries(result.latestStart),
          taskDetails: Object.fromEntries(result.taskDetails)
        }
      });
    } catch (error: any) {
      logger.error('Critical path analysis failed:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // 社区发现
  router.post('/community-detection', authenticateToken, async (req: any, res: any) => {
    try {
      const { tasks } = req.body;
      
      if (!tasks) {
        return res.status(400).json({ error: 'Missing tasks' });
      }

      const communities = algorithmService.detectTaskCommunities(tasks);
      
      res.json({
        success: true,
        communities: Object.fromEntries(communities)
      });
    } catch (error: any) {
      logger.error('Community detection failed:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // 分析用户精力模式
  router.post('/analyze-energy', authenticateToken, async (req: any, res: any) => {
    try {
      const userId = req.user.id;
      // Fetch all tasks (history)
      const tasks = await dbService.getTasksByUserId(userId);
      
      if (!tasks || tasks.length === 0) {
        return res.json({ success: true, periods: [] });
      }

      const periods = algorithmService.analyzeEnergyPatterns(tasks);
      
      // Save to DB
      await dbService.updateUserHighEnergyPeriods(userId, periods);
      
      res.json({ success: true, periods });
    } catch (error: any) {
      logger.error('Analyze energy failed:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // 完整个人日程安排
  router.post('/schedule-tasks', authenticateToken, async (req: any, res: any) => {
    try {
      const { tasks, config } = req.body;
      const userId = req.user.id;
      
      if (!tasks || !Array.isArray(tasks)) {
        return res.status(400).json({ error: 'Invalid tasks input' });
      }

      // Fetch user profile for high energy periods
      const user = await dbService.getUserById(userId);
      const highEnergyPeriods = user?.highEnergyPeriods || [];
      
      const finalConfig = {
          ...config,
          highEnergyPeriods
      };

      const result = await algorithmService.scheduleTasks(tasks, finalConfig);
      
      res.json({
        success: true,
        scheduledTasks: result.scheduledTasks,
        metrics: result.metrics
      });
    } catch (error: any) {
      logger.error('Schedule tasks failed:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // 完整团队任务安排
  router.post('/schedule-team-tasks', authenticateToken, async (req: any, res: any) => {
    try {
      const { members, meetingDetails, config } = req.body;
      
      if (!members || !Array.isArray(members) || !meetingDetails) {
        return res.status(400).json({ error: 'Invalid input parameters' });
      }

      const result = await algorithmService.scheduleTeamTasks(members, meetingDetails, config);
      
      // Convert Map to Object
      const adjustmentsObj = Object.fromEntries(result.adjustments);

      res.json({
        success: true,
        result: {
          ...result,
          adjustments: adjustmentsObj
        }
      });
    } catch (error: any) {
      logger.error('Schedule team tasks failed:', error);
      res.status(500).json({ error: error.message });
    }
  });

  return router;
}

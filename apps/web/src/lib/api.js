
import pb from '@/lib/pocketbaseClient';
import apiServerClient from '@/lib/apiServerClient';

const defaultOpts = { $autoCancel: false };

export const api = {
  updateUser: async (userId, data) => {
    return await pb.collection('users').update(userId, data, defaultOpts);
  },
  auth: {
    login: async (email, password) => {
      return await pb.collection('users').authWithPassword(email, password, defaultOpts);
    },
    signup: async (data) => {
      return await pb.collection('users').create(data, defaultOpts);
    },
    logout: () => {
      pb.authStore.clear();
    },
    requestPasswordReset: async (email) => {
      return await pb.collection('users').requestPasswordReset(email, defaultOpts);
    }
  },
  users: {
    getOne: async (id) => {
      return await pb.collection('users').getOne(id, defaultOpts);
    },
    update: async (id, data) => {
      return await pb.collection('users').update(id, data, defaultOpts);
    },
    getAll: async () => {
      return await pb.collection('users').getFullList(defaultOpts);
    },
  },
  projects: {
    getProject: async (userId) => {
      try {
        const records = await pb.collection('projects').getFullList({ 
          filter: `userId = "${userId}"`, 
          sort: '-created', 
          ...defaultOpts 
        });
        return records[0] || null;
      } catch (e) {
        console.error('Error fetching project:', e);
        return null;
      }
    },
    getAllProjects: async () => {
      return await pb.collection('projects').getFullList({ 
        expand: 'userId,intake_id', 
        sort: '-created', 
        ...defaultOpts 
      });
    },
    getProjectById: async (id) => {
      return await pb.collection('projects').getOne(id, { 
        expand: 'userId,intake_id', 
        ...defaultOpts 
      });
    },
    updateProject: async (id, data) => {
      return await pb.collection('projects').update(id, data, defaultOpts);
    },
    createProject: async (data) => {
      return await pb.collection('projects').create(data, defaultOpts);
    }
  },
  notifications: {
    getNotifications: async (userId) => {
      return await pb.collection('notifications').getList(1, 50, { 
        filter: `user_id = "${userId}"`, 
        sort: '-created', 
        ...defaultOpts 
      });
    },
    getUnreadCount: async (userId) => {
      try {
        const result = await pb.collection('notifications').getList(1, 1, { 
          filter: `user_id = "${userId}" && read = false`, 
          ...defaultOpts 
        });
        return result.totalItems;
      } catch (e) {
        console.error('Error getting unread notifications count:', e);
        return 0;
      }
    },
    markNotificationRead: async (id) => {
      return await pb.collection('notifications').update(id, { read: true }, defaultOpts);
    },
    markNotificationAsRead: async (id) => {
      return await pb.collection('notifications').update(id, { read: true }, defaultOpts);
    },
    markAllNotificationsRead: async (userId) => {
      try {
        const unread = await pb.collection('notifications').getFullList({ 
          filter: `user_id = "${userId}" && read = false`, 
          ...defaultOpts 
        });
        for (const notif of unread) {
          await pb.collection('notifications').update(notif.id, { read: true }, defaultOpts);
        }
      } catch (e) {
        console.error('Error marking all notifications read:', e);
      }
    },
    createWelcomeNotification: async (userId) => {
      try {
        return await pb.collection('notifications').create({
          user_id: userId,
          title: 'Willkommen bei agensia!',
          message: 'Schön, dass du da bist. Lass uns dein Projekt starten!',
          category: 'System',
          read: false
        }, defaultOpts);
      } catch (e) {
        console.error('Error creating welcome notification:', e);
      }
    },
    subscribeToNotifications: (userId, callback) => {
      return pb.collection('notifications').subscribe('*', (e) => {
        if (e.record.user_id === userId) {
          callback(e);
        }
      });
    }
  },
  activity_log: {
    getActivityLog: async (projectId) => {
      return await pb.collection('activity_log').getList(1, 50, { 
        filter: `project_id = "${projectId}"`, 
        expand: 'user_id', 
        sort: '-created', 
        ...defaultOpts 
      });
    },
    logActivity: async (projectId, action, description, metadata = {}) => {
      try {
        const userId = pb.authStore.model?.id;
        return await pb.collection('activity_log').create({
          project_id: projectId,
          user_id: userId,
          action,
          description,
          metadata
        }, defaultOpts);
      } catch (e) {
        console.error('Error logging activity:', e);
      }
    }
  },
  intake_submissions: {
    create: async (data) => {
      return await pb.collection('intake_submissions').create(data, defaultOpts);
    },
    getByUser: async (userId) => {
      return await pb.collection('intake_submissions').getFullList({ filter: `user_id = "${userId}"`, ...defaultOpts });
    },
    getAll: async () => {
      return await pb.collection('intake_submissions').getFullList(defaultOpts);
    },
    getAllIntakeSubmissions: async () => {
      return await pb.collection('intake_submissions').getFullList(defaultOpts);
    },
    getIntakeSubmission: async (id) => {
      return await pb.collection('intake_submissions').getOne(id, defaultOpts);
    },
    updateIntakeSubmission: async (id, data) => {
      return await pb.collection('intake_submissions').update(id, data, defaultOpts);
    },
    update: async (id, data) => {
      return await pb.collection('intake_submissions').update(id, data, defaultOpts);
    },
    delete: async (id) => {
      return await pb.collection('intake_submissions').delete(id, defaultOpts);
    },
  },
  messages: {
    create: async (data) => {
      return await pb.collection('messages').create(data, defaultOpts);
    },
    sendMessage: async (data) => {
      return await pb.collection('messages').create(data, defaultOpts);
    },
    getByProject: async (projectId) => {
      return await pb.collection('messages').getFullList({ filter: `projectId = "${projectId}"`, sort: 'created', ...defaultOpts });
    },
    getAll: async () => {
      return await pb.collection('messages').getFullList({ sort: 'created', ...defaultOpts });
    },
    subscribe: (callback) => {
      return pb.collection('messages').subscribe('*', callback);
    },
    unsubscribe: () => {
      return pb.collection('messages').unsubscribe('*');
    },
    markMessagesRead: async (senderId) => {
      try {
        const currentUserId = pb.authStore.model?.id;
        if (!currentUserId) return;
        
        const unread = await pb.collection('messages').getFullList({
          filter: `senderId = "${senderId}" && read = false`,
          ...defaultOpts
        });
        
        for (const msg of unread) {
          await pb.collection('messages').update(msg.id, { read: true }, defaultOpts);
        }
      } catch (e) {
        console.warn('Could not mark messages as read:', e);
      }
    },
    getUnreadMessageCount: async () => {
      try {
        const currentUserId = pb.authStore.model?.id;
        if (!currentUserId) return 0;
        
        const result = await pb.collection('messages').getList(1, 1, {
          filter: `senderId != "${currentUserId}" && read = false`,
          ...defaultOpts
        });
        return result.totalItems;
      } catch (e) {
        console.error('Error getting unread message count:', e);
        return 0;
      }
    },
    getConversations: async () => {
      try {
        const currentUserId = pb.authStore.model?.id;
        if (!currentUserId) return [];
        
        const allMsgs = await pb.collection('messages').getFullList({ sort: '-created', ...defaultOpts });
        const convos = {};
        
        allMsgs.forEach(msg => {
          const partnerId = msg.senderId === currentUserId ? msg.projectId : msg.senderId;
          if (!partnerId) return;
          
          if (!convos[partnerId]) {
            convos[partnerId] = { 
              partnerId, 
              lastMessage: msg, 
              unreadCount: 0 
            };
          }
          
          if (msg.senderId === partnerId && !msg.read) {
            convos[partnerId].unreadCount++;
          }
        });
        
        return Object.values(convos);
      } catch (e) {
        console.error('Error getting conversations:', e);
        return [];
      }
    }
  },
  tasks: {
    create: async (projectId, title, description, type = 'general') => {
      return await pb.collection('tasks').create({
        projectId,
        title,
        description,
        type,
        status: 'open'
      }, defaultOpts);
    },
    createTask: async (data) => {
      return await pb.collection('tasks').create(data, defaultOpts);
    },
    getByProject: async (projectId) => {
      return await pb.collection('tasks').getFullList({ filter: `projectId = "${projectId}"`, ...defaultOpts });
    },
    getTasksByProject: async (projectId) => {
      return await pb.collection('tasks').getList(1, 50, { 
        filter: `project_id = "${projectId}"`, 
        sort: '-created', 
        ...defaultOpts 
      });
    },
    getAll: async () => {
      return await pb.collection('tasks').getFullList(defaultOpts);
    },
    updateStatus: async (taskId, status) => {
      return await pb.collection('tasks').update(taskId, { status }, defaultOpts);
    },
    updateTask: async (id, data) => {
      return await pb.collection('tasks').update(id, data, defaultOpts);
    },
    delete: async (taskId) => {
      return await pb.collection('tasks').delete(taskId, defaultOpts);
    },
    deleteTask: async (id) => {
      return await pb.collection('tasks').delete(id, defaultOpts);
    }
  },
  files: {
    create: async (data) => {
      return await pb.collection('uploaded_files').create(data, defaultOpts);
    },
    uploadFile: async (data) => {
      return await pb.collection('uploaded_files').create(data, defaultOpts);
    },
    getByUser: async (userId) => {
      return await pb.collection('uploaded_files').getFullList({ filter: `user_id = "${userId}"`, ...defaultOpts });
    },
    getFiles: async (userId) => {
      return await pb.collection('uploaded_files').getFullList({ filter: `user_id = "${userId}"`, ...defaultOpts });
    },
    getAll: async () => {
      return await pb.collection('uploaded_files').getFullList(defaultOpts);
    },
    delete: async (id) => {
      return await pb.collection('uploaded_files').delete(id, defaultOpts);
    },
  },
  payments: {
    create: async (data) => {
      return await pb.collection('payments').create(data, defaultOpts);
    },
    createRecord: async (userId, amount, packageId) => {
      return await pb.collection('payments').create({
        userId,
        amount,
        packageId,
        status: 'completed'
      }, defaultOpts);
    },
    getByUser: async (userId) => {
      return await pb.collection('payments').getFullList({ filter: `userId = "${userId}"`, ...defaultOpts });
    },
    getAll: async () => {
      return await pb.collection('payments').getFullList(defaultOpts);
    },
    update: async (id, data) => {
      return await pb.collection('payments').update(id, data, defaultOpts);
    },
  },
  admin: {
    createUserFromIntake: async (intakeId) => {
      const intake = await pb.collection('intake_submissions').getOne(intakeId, defaultOpts);
      if (intake.user_id) throw new Error('User already exists for this intake.');
      
      const tempPassword = Math.random().toString(36).slice(-8) + 'A1!';
      
      const newUser = await pb.collection('users').create({
        email: intake.email,
        password: tempPassword,
        passwordConfirm: tempPassword,
        name: intake.name,
        role: 'user',
        company_name: intake.company_name,
        phone: intake.phone
      }, defaultOpts);

      await pb.collection('intake_submissions').update(intakeId, { user_id: newUser.id }, defaultOpts);
      
      await api.tasks.create(newUser.id, 'Briefing ausfüllen', 'Alle Details zum Projekt angeben');
      await api.tasks.create(newUser.id, 'Inhalte hochladen', 'Texte und Bilder in der Cloud ablegen');

      return { email: newUser.email, password: tempPassword };
    },
    createProjectFromIntake: async (intakeId) => {
      const intake = await pb.collection('intake_submissions').getOne(intakeId, defaultOpts);

      let userId;
      const tempPassword = Math.random().toString(36).slice(-10) + 'A1!';
      try {
        const newUser = await pb.collection('users').create({
          email: intake.email,
          password: tempPassword,
          passwordConfirm: tempPassword,
          name: intake.name,
          role: 'user',
          company_name: intake.company_name,
          phone: intake.phone,
          selected_package: intake.package || intake.selected_package
        }, defaultOpts);
        userId = newUser.id;
      } catch (e) {
        const existingUsers = await pb.collection('users').getFullList({
          filter: `email = "${intake.email}"`,
          ...defaultOpts
        });
        if (existingUsers.length > 0) {
          userId = existingUsers[0].id;
        } else {
          throw new Error('Failed to create or find user: ' + e.message);
        }
      }

      const project = await pb.collection('projects').create({
        userId: userId,
        intake_id: intake.id,
        title: `Website für ${intake.company_name || intake.name}`,
        niche: intake.niche || intake.niche_slug,
        color_group: intake.color_group,
        package: intake.package || intake.selected_package,
        status: 'planning'
      }, defaultOpts);

      const defaultTasks = [
        { title: "Firmeninfos vervollständigen", priority: "high", assigned_to: "user" },
        { title: "Logo in hoher Auflösung hochladen", priority: "high", assigned_to: "user" },
        { title: "Texte für die Website liefern", priority: "medium", assigned_to: "user" },
        { title: "Farbwünsche & Referenzen angeben", priority: "medium", assigned_to: "user" },
        { title: "Zielgruppe genauer beschreiben", priority: "low", assigned_to: "user" }
      ];

      for (const task of defaultTasks) {
        await pb.collection('tasks').create({
          projectId: project.id,
          title: task.title,
          priority: task.priority,
          assigned_to: task.assigned_to,
          status: 'open'
        }, defaultOpts);
      }

      const adminId = pb.authStore.model?.id;
      await pb.collection('messages').create({
        projectId: project.id,
        senderId: adminId,
        content: `Hallo ${intake.name},\n\nherzlich willkommen bei agensia! Wir freuen uns auf die Zusammenarbeit an deinem Projekt "${project.title}". Bitte schau dir die ersten Aufgaben an, damit wir schnellstmöglich starten können.\n\nViele Grüße,\nDein agensia Team`
      }, defaultOpts);

      await pb.collection('notifications').create({
        user_id: userId,
        category: 'System',
        title: 'Willkommen bei agensia!',
        message: 'Dein Projekt wurde erfolgreich angelegt.',
        read: false
      }, defaultOpts);

      await pb.collection('activity_log').create({
        project_id: project.id,
        user_id: adminId,
        action: 'status_change',
        description: 'Projekt erstellt aus Intake-Formular'
      }, defaultOpts);

      await pb.collection('intake_submissions').update(intake.id, {
        status: 'In Bearbeitung',
        user_id: userId
      }, defaultOpts);

      return { project, userId, tempPassword };
    },
    getProjectStats: async () => {
      const users = await pb.collection('users').getFullList({ filter: 'role = "user"', ...defaultOpts });
      const intakes = await pb.collection('intake_submissions').getFullList(defaultOpts);
      const payments = await pb.collection('payments').getFullList({ filter: 'status = "completed"', ...defaultOpts });
      
      const now = new Date();
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      
      const newThisWeek = users.filter(u => new Date(u.created) > oneWeekAgo).length;
      const inProgress = intakes.filter(i => i.status === 'In Bearbeitung').length;
      const totalRevenue = payments.reduce((sum, p) => sum + (p.amount || 0), 0);

      return {
        totalCustomers: users.length,
        newThisWeek,
        inProgress,
        totalRevenue
      };
    }
  },
  stripe_config: {
    get: async () => {
      const records = await pb.collection('stripe_config').getFullList(defaultOpts);
      return records[0] || null;
    },
    create: async (data) => {
      return await pb.collection('stripe_config').create(data, defaultOpts);
    },
    update: async (id, data) => {
      return await pb.collection('stripe_config').update(id, data, defaultOpts);
    },
  },
  portfolio: {
    create: async (data) => {
      return await pb.collection('portfolio').create(data, defaultOpts);
    },
    getAll: async () => {
      return await pb.collection('portfolio').getFullList(defaultOpts);
    },
    update: async (id, data) => {
      return await pb.collection('portfolio').update(id, data, defaultOpts);
    },
    delete: async (id) => {
      return await pb.collection('portfolio').delete(id, defaultOpts);
    },
  },
  revisions: {
    create: async (data) => await pb.collection('revisions').create(data, defaultOpts),
    getAll: async () => await pb.collection('revisions').getFullList({ expand: 'project_id,user_id', sort: '-created', ...defaultOpts }),
    getByUser: async (userId) => await pb.collection('revisions').getFullList({ filter: `user_id = "${userId}"`, expand: 'project_id', sort: '-created', ...defaultOpts }),
    getByProject: async (projectId) => await pb.collection('revisions').getFullList({ filter: `project_id = "${projectId}"`, expand: 'user_id', sort: '-created', ...defaultOpts }),
    getOne: async (id) => await pb.collection('revisions').getOne(id, { expand: 'project_id,user_id', ...defaultOpts }),
    update: async (id, data) => await pb.collection('revisions').update(id, data, defaultOpts),
    delete: async (id) => await pb.collection('revisions').delete(id, defaultOpts),
  },
  revision_packages: {
    create: async (data) => await pb.collection('revision_packages').create(data, defaultOpts),
    getByUser: async (userId) => await pb.collection('revision_packages').getFullList({ filter: `user_id = "${userId}"`, expand: 'project_id', sort: '-created', ...defaultOpts }),
    getByProject: async (projectId) => await pb.collection('revision_packages').getFullList({ filter: `project_id = "${projectId}"`, expand: 'user_id', sort: '-created', ...defaultOpts }),
    getActive: async (userId) => await pb.collection('revision_packages').getFullList({ filter: `user_id = "${userId}" && status = "aktiv"`, sort: '-created', ...defaultOpts }),
    update: async (id, data) => await pb.collection('revision_packages').update(id, data, defaultOpts),
    incrementUsed: async (id) => {
      const pkg = await pb.collection('revision_packages').getOne(id, defaultOpts);
      const used = (pkg.used_revisions || 0) + 1;
      const status = used >= pkg.total_revisions ? 'aufgebraucht' : pkg.status;
      return await pb.collection('revision_packages').update(id, { used_revisions: used, status }, defaultOpts);
    }
  },
  revision_comments: {
    create: async (data) => await pb.collection('revision_comments').create(data, defaultOpts),
    getByRevision: async (revisionId) => await pb.collection('revision_comments').getFullList({ filter: `revision_id = "${revisionId}"`, expand: 'user_id', sort: 'created', ...defaultOpts }),
    delete: async (id) => await pb.collection('revision_comments').delete(id, defaultOpts),
  },
  design_reviews: {
    create: async (data) => await pb.collection('design_reviews').create(data, defaultOpts),
    getAll: async () => await pb.collection('design_reviews').getFullList({ expand: 'project_id,user_id,created_by', sort: '-created', ...defaultOpts }),
    getByProject: async (projectId) => await pb.collection('design_reviews').getFullList({ filter: `project_id = "${projectId}"`, expand: 'user_id,created_by', sort: '-created', ...defaultOpts }),
    getByUser: async (userId) => await pb.collection('design_reviews').getFullList({ filter: `user_id = "${userId}"`, expand: 'project_id,created_by', sort: '-created', ...defaultOpts }),
    getOne: async (id) => await pb.collection('design_reviews').getOne(id, { expand: 'project_id,user_id,created_by', ...defaultOpts }),
    update: async (id, data) => await pb.collection('design_reviews').update(id, data, defaultOpts),
    delete: async (id) => await pb.collection('design_reviews').delete(id, defaultOpts),
  },
  design_feedback: {
    create: async (data) => await pb.collection('design_feedback').create(data, defaultOpts),
    getByReview: async (reviewId) => await pb.collection('design_feedback').getFullList({ filter: `review_id = "${reviewId}"`, expand: 'user_id', sort: 'created', ...defaultOpts }),
    update: async (id, data) => await pb.collection('design_feedback').update(id, data, defaultOpts),
    delete: async (id) => await pb.collection('design_feedback').delete(id, defaultOpts),
  },
  content_forms: {
    create: async (data) => await pb.collection('content_forms').create(data, defaultOpts),
    getAll: async () => await pb.collection('content_forms').getFullList({ expand: 'project_id,user_id,created_by', sort: '-created', ...defaultOpts }),
    getByUser: async (userId) => await pb.collection('content_forms').getFullList({ filter: `user_id = "${userId}"`, expand: 'project_id,created_by', sort: '-created', ...defaultOpts }),
    getOne: async (id) => await pb.collection('content_forms').getOne(id, { expand: 'project_id,user_id,created_by', ...defaultOpts }),
    update: async (id, data) => await pb.collection('content_forms').update(id, data, defaultOpts),
    delete: async (id) => await pb.collection('content_forms').delete(id, defaultOpts),
  },
  content_form_responses: {
    create: async (data) => await pb.collection('content_form_responses').create(data, defaultOpts),
    getByForm: async (formId) => await pb.collection('content_form_responses').getFullList({ filter: `form_id = "${formId}"`, expand: 'user_id', sort: '-created', ...defaultOpts }),
    getByUser: async (userId) => await pb.collection('content_form_responses').getFullList({ filter: `user_id = "${userId}"`, expand: 'form_id', sort: '-created', ...defaultOpts }),
    getOne: async (id) => await pb.collection('content_form_responses').getOne(id, { expand: 'form_id,user_id', ...defaultOpts }),
    update: async (id, data) => await pb.collection('content_form_responses').update(id, data, defaultOpts),
    delete: async (id) => await pb.collection('content_form_responses').delete(id, defaultOpts),
  },
  admin_notes: {
    create: async (data) => await pb.collection('admin_notes').create(data, defaultOpts),
    getByUser: async (userId) => await pb.collection('admin_notes').getFullList({ filter: `user_id = "${userId}"`, expand: 'admin_id', sort: '-pinned,-created', ...defaultOpts }),
    update: async (id, data) => await pb.collection('admin_notes').update(id, data, defaultOpts),
    delete: async (id) => await pb.collection('admin_notes').delete(id, defaultOpts),
    togglePin: async (id, currentPinStatus) => await pb.collection('admin_notes').update(id, { pinned: !currentPinStatus }, defaultOpts),
  },
  app_settings: {
    getAll: async () => await pb.collection('app_settings').getFullList({ sort: 'category,key', ...defaultOpts }),
    getByCategory: async (category) => await pb.collection('app_settings').getFullList({ filter: `category = "${category}"`, sort: 'key', ...defaultOpts }),
    get: async (key) => {
      try {
        const records = await pb.collection('app_settings').getFullList({ filter: `key = "${key}"`, ...defaultOpts });
        return records.length > 0 ? records[0] : null;
      } catch (e) {
        console.error(`Error fetching app setting ${key}:`, e);
        return null;
      }
    },
    set: async (key, value, category = 'general') => {
      try {
        const records = await pb.collection('app_settings').getFullList({ filter: `key = "${key}"`, ...defaultOpts });
        if (records.length > 0) {
          return await pb.collection('app_settings').update(records[0].id, { value, category }, defaultOpts);
        } else {
          return await pb.collection('app_settings').create({ key, value, category }, defaultOpts);
        }
      } catch (e) {
        console.error(`Error setting app setting ${key}:`, e);
        throw e;
      }
    },
    delete: async (id) => await pb.collection('app_settings').delete(id, defaultOpts),
  },
  website_content: {
    getByUser: async (userId) => {
      return await pb.collection('website_content').getFullList({ filter: `user_id = "${userId}"`, sort: 'sort_order', ...defaultOpts });
    },
    getByProject: async (projectId) => {
      return await pb.collection('website_content').getFullList({ filter: `project_id = "${projectId}"`, sort: 'sort_order', ...defaultOpts });
    },
    update: async (id, data) => {
      return await pb.collection('website_content').update(id, data, defaultOpts);
    },
    initializeSections: async (userId, projectId) => {
      const existing = await pb.collection('website_content').getFullList({ filter: `project_id = "${projectId}"`, ...defaultOpts });
      if (existing.length > 0) return existing;

      const sections = [
        { key: 'hero', label: 'Startseite / Hero' },
        { key: 'ueber-uns', label: 'Über uns' },
        { key: 'leistungen', label: 'Leistungen' },
        { key: 'team', label: 'Team' },
        { key: 'referenzen', label: 'Referenzen' },
        { key: 'faq', label: 'FAQ' },
        { key: 'kontakt', label: 'Kontakt' },
        { key: 'impressum', label: 'Impressum / Datenschutz' }
      ];

      const created = [];
      for (let i = 0; i < sections.length; i++) {
        const sec = sections[i];
        const record = await pb.collection('website_content').create({
          user_id: userId,
          project_id: projectId,
          section_key: sec.key,
          section_label: sec.label,
          content: '',
          notes: '',
          status: 'leer',
          sort_order: i + 1
        }, defaultOpts);
        created.push(record);
      }
      return created;
    }
  },
  hosting: {
    getSubscription: async (userId) => {
      try {
        const res = await apiServerClient.fetch(`/stripe/subscription/${userId}`);
        if (!res.ok) throw new Error('Failed to fetch subscription');
        return await res.json();
      } catch (e) {
        console.error(e);
        return { status: 'inactive', currentPeriodEnd: null, plan: null };
      }
    },
    createCheckoutSession: async (data) => {
      const res = await apiServerClient.fetch('/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to create checkout session');
      }
      return await res.json();
    },
    cancelSubscription: async (userId) => {
      const res = await apiServerClient.fetch('/stripe/cancel-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });
      if (!res.ok) throw new Error('Failed to cancel subscription');
      return await res.json();
    },
    updateSubscription: async (data) => {
      const res = await apiServerClient.fetch('/stripe/update-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('Failed to update subscription');
      return await res.json();
    },
    getLogs: async (userId) => {
      try {
        return await pb.collection('hosting_logs').getFullList({
          filter: `user_id = "${userId}"`,
          sort: '-created',
          $autoCancel: false
        });
      } catch (e) {
        console.error(e);
        return [];
      }
    }
  }
};

import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

interface HelpSection {
  id: string;
  title: string;
  icon: string;
  description: string;
  topics: HelpTopic[];
}

interface HelpTopic {
  id: string;
  title: string;
  content: string;
  steps?: string[];
  tips?: string[];
  screenshot?: string;
}

interface FAQ {
  question: string;
  answer: string;
  category: string;
}

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss']
})
export class HelpComponent implements OnInit {
  
  searchQuery = '';
  selectedSection = '';
  selectedTopic = '';
  filteredSections: HelpSection[] = [];

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  helpSections: HelpSection[] = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: 'play_circle',
      description: 'Learn the basics of using the maintenance management system',
      topics: [
        {
          id: 'overview',
          title: 'System Overview',
          content: 'Welcome to the Maintenance Management System! This comprehensive platform helps you manage equipment, schedule maintenance tasks, track inventory, and generate reports.',
          steps: [
            'Navigate using the sidebar menu on the left',
            'Access different modules: Equipment, Tasks, Schedule, Inventory, Reports',
            'Use the search functionality to quickly find information',
            'Customize your preferences in Settings'
          ],
          tips: [
            'Start by reviewing your equipment list',
            'Set up maintenance schedules for critical equipment',
            'Configure notifications to stay informed'
          ]
        },
        {
          id: 'navigation',
          title: 'Navigation Guide',
          content: 'Learn how to efficiently navigate through the application and access different features.',
          steps: [
            'Click on the hamburger menu (☰) to open/close the sidebar',
            'Select any module from the sidebar to navigate',
            'Use the breadcrumb navigation for context',
            'Access user settings from the profile menu'
          ],
          tips: [
            'The sidebar auto-collapses on mobile devices',
            'Use keyboard shortcuts for faster navigation',
            'Bookmark frequently used pages'
          ]
        },
        {
          id: 'dashboard',
          title: 'Dashboard Features',
          content: 'Understanding the main dashboard and its key performance indicators.',
          steps: [
            'Review key metrics displayed on cards',
            'Check recent activity feeds',
            'Monitor equipment status indicators',
            'View upcoming maintenance alerts'
          ]
        }
      ]
    },
    {
      id: 'equipment',
      title: 'Equipment Management',
      icon: 'precision_manufacturing',
      description: 'Learn how to manage your equipment inventory and specifications',
      topics: [
        {
          id: 'add-equipment',
          title: 'Adding New Equipment',
          content: 'Step-by-step guide to register new equipment in the system.',
          steps: [
            'Navigate to the Equipment module',
            'Click the "Add Equipment" button',
            'Fill in equipment details: name, model, serial number',
            'Set equipment category and location',
            'Upload equipment photos or manuals',
            'Save the equipment record'
          ],
          tips: [
            'Use descriptive names for easy identification',
            'Include purchase date and warranty information',
            'Tag equipment with relevant keywords'
          ]
        },
        {
          id: 'equipment-details',
          title: 'Equipment Details & History',
          content: 'View comprehensive equipment information and maintenance history.',
          steps: [
            'Click on any equipment from the list',
            'Review equipment specifications',
            'Check maintenance history timeline',
            'View associated parts and documentation'
          ]
        },
        {
          id: 'equipment-status',
          title: 'Equipment Status Management',
          content: 'Understanding and updating equipment operational status.',
          steps: [
            'Monitor equipment status indicators',
            'Update status when equipment goes offline',
            'Set equipment as out-of-service when needed',
            'Track equipment downtime and availability'
          ]
        }
      ]
    },
    {
      id: 'maintenance',
      title: 'Maintenance Tasks',
      icon: 'build_circle',
      description: 'Create, assign, and track maintenance activities',
      topics: [
        {
          id: 'create-task',
          title: 'Creating Maintenance Tasks',
          content: 'Learn how to create and configure maintenance tasks for your equipment.',
          steps: [
            'Go to Maintenance Tasks module',
            'Click "New Task" button',
            'Select equipment and task type',
            'Set priority and due date',
            'Assign technician and add instructions',
            'Attach required parts and documents'
          ],
          tips: [
            'Use task templates for common procedures',
            'Set appropriate priority levels',
            'Include detailed instructions and safety notes'
          ]
        },
        {
          id: 'task-types',
          title: 'Understanding Task Types',
          content: 'Different types of maintenance tasks and their purposes.',
          steps: [
            'Preventive: Regular scheduled maintenance',
            'Corrective: Repairs and fixes',
            'Emergency: Urgent unplanned maintenance',
            'Inspection: Routine checks and assessments',
            'Calibration: Precision adjustments'
          ]
        },
        {
          id: 'task-workflow',
          title: 'Task Workflow & Status',
          content: 'Understanding task progression and status updates.',
          steps: [
            'Tasks start in "Pending" status',
            'Move to "In Progress" when work begins',
            'Update to "Completed" when finished',
            'Review and approve completed tasks'
          ]
        }
      ]
    },
    {
      id: 'scheduling',
      title: 'Schedule Management',
      icon: 'schedule',
      description: 'Plan and organize maintenance activities using the calendar',
      topics: [
        {
          id: 'calendar-view',
          title: 'Using Calendar View',
          content: 'Navigate and use the calendar interface effectively.',
          steps: [
            'Switch between month, week, and day views',
            'Click on dates to see scheduled tasks',
            'Drag and drop tasks to reschedule',
            'Use color coding to identify task types'
          ]
        },
        {
          id: 'scheduling-tasks',
          title: 'Scheduling New Tasks',
          content: 'How to schedule maintenance tasks using the calendar.',
          steps: [
            'Click on a calendar date',
            'Select "Add Task" from the popup',
            'Choose equipment and task details',
            'Set duration and assigned technician',
            'Save to confirm scheduling'
          ]
        },
        {
          id: 'recurring-tasks',
          title: 'Setting Up Recurring Tasks',
          content: 'Configure automatic recurring maintenance schedules.',
          steps: [
            'Create a maintenance task',
            'Enable "Recurring" option',
            'Set frequency (daily, weekly, monthly)',
            'Define end date or number of occurrences',
            'Save to create recurring series'
          ]
        }
      ]
    },
    {
      id: 'inventory',
      title: 'Parts Inventory',
      icon: 'inventory_2',
      description: 'Manage spare parts, track stock levels, and handle procurement',
      topics: [
        {
          id: 'parts-management',
          title: 'Managing Parts Inventory',
          content: 'Add, update, and organize your spare parts inventory.',
          steps: [
            'Navigate to Parts Inventory module',
            'Add new parts with details and photos',
            'Set minimum stock levels for alerts',
            'Categorize parts for easy searching',
            'Track part usage and costs'
          ]
        },
        {
          id: 'stock-tracking',
          title: 'Stock Level Monitoring',
          content: 'Keep track of inventory levels and get low stock alerts.',
          steps: [
            'Monitor current stock quantities',
            'Set up low stock alert thresholds',
            'Review stock movement history',
            'Generate reorder reports'
          ]
        },
        {
          id: 'procurement',
          title: 'Parts Procurement',
          content: 'Managing purchase orders and supplier relationships.',
          steps: [
            'Create purchase orders for needed parts',
            'Track order status and delivery dates',
            'Receive and update inventory',
            'Maintain supplier contact information'
          ]
        }
      ]
    },
    {
      id: 'reports',
      title: 'Reports & Analytics',
      icon: 'analytics',
      description: 'Generate insights and reports from your maintenance data',
      topics: [
        {
          id: 'report-types',
          title: 'Understanding Report Types',
          content: 'Learn about different reports available in the system.',
          steps: [
            'Maintenance History: Track completed work',
            'Cost Analysis: Monitor maintenance expenses',
            'Equipment Efficiency: Performance metrics',
            'Downtime Analysis: Identify improvement areas'
          ]
        },
        {
          id: 'generating-reports',
          title: 'Generating Custom Reports',
          content: 'Create and customize reports for your needs.',
          steps: [
            'Select report type and date range',
            'Choose filters and parameters',
            'Preview report before generating',
            'Export to PDF or Excel format'
          ]
        },
        {
          id: 'kpis',
          title: 'Key Performance Indicators',
          content: 'Understanding important maintenance metrics.',
          steps: [
            'MTBF: Mean Time Between Failures',
            'MTTR: Mean Time To Repair',
            'Equipment Availability',
            'Maintenance Cost per Equipment',
            'Preventive vs Corrective Maintenance Ratio'
          ]
        }
      ]
    },
    {
      id: 'settings',
      title: 'System Settings',
      icon: 'settings',
      description: 'Configure system preferences and user settings',
      topics: [
        {
          id: 'user-profile',
          title: 'Managing User Profile',
          content: 'Update your personal information and preferences.',
          steps: [
            'Go to Settings > Profile tab',
            'Update personal information',
            'Change password if needed',
            'Set notification preferences'
          ]
        },
        {
          id: 'system-config',
          title: 'System Configuration',
          content: 'Configure system-wide settings and preferences.',
          steps: [
            'Set default task durations',
            'Configure working hours',
            'Set up notification rules',
            'Configure backup schedules'
          ]
        },
        {
          id: 'user-management',
          title: 'User Management (Admin)',
          content: 'Manage user accounts and permissions (admin only).',
          steps: [
            'Add new user accounts',
            'Assign roles and permissions',
            'Manage user access levels',
            'Deactivate inactive accounts'
          ]
        }
      ]
    }
  ];

  faqItems: FAQ[] = [
    {
      question: 'How do I reset my password?',
      answer: 'Go to Settings > Profile tab and click "Change Password". You will need to enter your current password and new password.',
      category: 'Account'
    },
    {
      question: 'Can I assign multiple technicians to one task?',
      answer: 'Currently, each task can be assigned to one primary technician. However, you can add additional team members in the task notes.',
      category: 'Tasks'
    },
    {
      question: 'How do I set up recurring maintenance schedules?',
      answer: 'Create a maintenance task and enable the "Recurring" option. Set your desired frequency and the system will automatically create future tasks.',
      category: 'Scheduling'
    },
    {
      question: 'What happens when parts inventory runs low?',
      answer: 'The system will automatically notify designated personnel when parts reach the minimum stock level you have configured.',
      category: 'Inventory'
    },
    {
      question: 'Can I export maintenance reports?',
      answer: 'Yes, all reports can be exported to PDF or Excel formats. Use the Export button in the Reports module.',
      category: 'Reports'
    },
    {
      question: 'How do I add new equipment to the system?',
      answer: 'Navigate to Equipment module and click "Add Equipment". Fill in the required details including name, model, serial number, and location.',
      category: 'Equipment'
    },
    {
      question: 'Can I customize notification settings?',
      answer: 'Yes, go to Settings > System tab to configure email and SMS notifications for various events like overdue tasks and low inventory.',
      category: 'Settings'
    },
    {
      question: 'What is the difference between preventive and corrective maintenance?',
      answer: 'Preventive maintenance is scheduled regular upkeep to prevent failures. Corrective maintenance is performed to fix equipment that has already failed.',
      category: 'Maintenance'
    }
  ];

  constructor(private breakpointObserver: BreakpointObserver) {}

  ngOnInit(): void {
    this.filteredSections = [...this.helpSections];
  }

  searchHelp(): void {
    if (!this.searchQuery.trim()) {
      this.filteredSections = [...this.helpSections];
      return;
    }

    const query = this.searchQuery.toLowerCase();
    this.filteredSections = this.helpSections.filter(section => 
      section.title.toLowerCase().includes(query) ||
      section.description.toLowerCase().includes(query) ||
      section.topics.some(topic => 
        topic.title.toLowerCase().includes(query) ||
        topic.content.toLowerCase().includes(query)
      )
    );
  }

  selectSection(sectionId: string): void {
    this.selectedSection = sectionId;
    this.selectedTopic = '';
  }

  selectTopic(topicId: string): void {
    this.selectedTopic = topicId;
  }

  getCurrentSection(): HelpSection | undefined {
    return this.helpSections.find(section => section.id === this.selectedSection);
  }

  getCurrentTopic(): HelpTopic | undefined {
    const section = this.getCurrentSection();
    return section?.topics.find(topic => topic.id === this.selectedTopic);
  }

  getFilteredFAQs(): FAQ[] {
    if (!this.searchQuery.trim()) {
      return this.faqItems;
    }
    
    const query = this.searchQuery.toLowerCase();
    return this.faqItems.filter(faq => 
      faq.question.toLowerCase().includes(query) ||
      faq.answer.toLowerCase().includes(query) ||
      faq.category.toLowerCase().includes(query)
    );
  }

  getFAQCategories(): string[] {
    return [...new Set(this.faqItems.map(faq => faq.category))];
  }

  getFAQsByCategory(category: string): FAQ[] {
    return this.getFilteredFAQs().filter(faq => faq.category === category);
  }

  goBackToSections(): void {
    this.selectedSection = '';
    this.selectedTopic = '';
  }

  goBackToTopics(): void {
    this.selectedTopic = '';
  }

  printPage(): void {
    window.print();
  }

  shareHelp(): void {
    if (navigator.share) {
      navigator.share({
        title: 'Maintenance Management System Help',
        text: 'Check out this helpful guide for using the maintenance management system.',
        url: window.location.href
      });
    } else {
      // Fallback - copy URL to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Help page URL copied to clipboard!');
    }
  }
}
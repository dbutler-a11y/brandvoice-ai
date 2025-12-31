// BrandVoice Sales Bot - Flow Engine

import {
  Lead,
  FlowStep,
  ProductTier,
  PRODUCTS,
  FLOW_TRIGGERS,
  CONFIG
} from './types';
import {
  MESSAGES,
  INDUSTRY_SAMPLES,
  getDaysUntilSaleEnds
} from './messages';
import {
  shouldUseAI,
  generateResponse,
  getConversationHistory,
  addToConversationHistory
} from './ai-handler';

// ============================================
// FLOW ENGINE
// ============================================

export interface FlowResponse {
  messages: string[];
  nextStep: FlowStep;
  updateLead?: Partial<Lead>;
  usedAI?: boolean;
}

export class FlowEngine {
  // Detect which flow to start based on trigger words
  static detectFlow(message: string): ProductTier | 'discovery' | null {
    const normalized = message.toLowerCase().trim();

    // Check for exact trigger words
    for (const [trigger, flow] of Object.entries(FLOW_TRIGGERS)) {
      if (normalized.includes(trigger)) {
        return flow;
      }
    }

    // Check for greetings
    const greetings = ['hi', 'hello', 'hey', 'yo', 'sup', 'start'];
    if (greetings.some(g => normalized === g || normalized.startsWith(g + ' '))) {
      return 'discovery';
    }

    return null;
  }

  // Process a message and return response (sync version for scripted flows)
  static processMessage(lead: Lead, message: string): FlowResponse {
    const normalized = message.toLowerCase().trim();

    // Handle commands first
    if (normalized.startsWith('/')) {
      return this.handleCommand(normalized, lead);
    }

    // If no current flow, try to detect one
    if (!lead.currentFlow) {
      const detectedFlow = this.detectFlow(message);
      if (detectedFlow) {
        return this.startFlow(lead, detectedFlow);
      }
      // No flow detected, show welcome
      return {
        messages: [MESSAGES.WELCOME_GENERIC],
        nextStep: 'welcome'
      };
    }

    // Continue current flow
    return this.continueFlow(lead, message);
  }

  // Process a message with AI support (async version)
  static async processMessageWithAI(lead: Lead, message: string): Promise<FlowResponse> {
    const normalized = message.toLowerCase().trim();

    // Handle commands first (always scripted)
    if (normalized.startsWith('/')) {
      const response = this.handleCommand(normalized, lead);
      addToConversationHistory(lead.id, 'user', message);
      addToConversationHistory(lead.id, 'assistant', response.messages.join('\n\n'));
      return response;
    }

    // Check if this should use AI or scripted flow
    if (shouldUseAI(message, lead)) {
      // Use AI for natural conversation
      const history = getConversationHistory(lead.id);
      const aiResult = await generateResponse(message, lead, history);

      // Store in conversation history
      addToConversationHistory(lead.id, 'user', message);
      addToConversationHistory(lead.id, 'assistant', aiResult.response);

      return {
        messages: [aiResult.response],
        nextStep: lead.currentStep,
        updateLead: aiResult.suggestedUpdates,
        usedAI: true
      };
    }

    // Use scripted flow for simple responses
    const response = this.processMessage(lead, message);

    // Store in conversation history
    addToConversationHistory(lead.id, 'user', message);
    addToConversationHistory(lead.id, 'assistant', response.messages.join('\n\n'));

    return response;
  }

  // Start a new flow
  static startFlow(lead: Lead, flow: ProductTier | 'discovery'): FlowResponse {
    const daysLeft = getDaysUntilSaleEnds();

    switch (flow) {
      case 'starter':
        return {
          messages: [MESSAGES.STARTER_WELCOME],
          nextStep: 'qualify_business',
          updateLead: { currentFlow: 'starter', status: 'engaged' }
        };

      case 'launch':
        return {
          messages: [MESSAGES.LAUNCH_WELCOME],
          nextStep: 'qualify_business',
          updateLead: { currentFlow: 'launch', status: 'engaged' }
        };

      case 'engine':
        return {
          messages: [MESSAGES.ENGINE_WELCOME],
          nextStep: 'qualify_business',
          updateLead: { currentFlow: 'engine', status: 'engaged' }
        };

      case 'discovery':
      default:
        return {
          messages: [MESSAGES.DISCOVERY_WELCOME],
          nextStep: 'qualify_business',
          updateLead: { currentFlow: 'discovery', status: 'engaged' }
        };
    }
  }

  // Continue an existing flow
  static continueFlow(lead: Lead, message: string): FlowResponse {
    const normalized = message.toLowerCase().trim();
    const flow = lead.currentFlow;

    // Route to appropriate flow handler
    switch (flow) {
      case 'starter':
        return this.handleStarterFlow(lead, normalized);
      case 'launch':
        return this.handleLaunchFlow(lead, normalized);
      case 'engine':
        return this.handleEngineFlow(lead, normalized);
      case 'discovery':
        return this.handleDiscoveryFlow(lead, normalized);
      default:
        return {
          messages: [MESSAGES.FALLBACK],
          nextStep: lead.currentStep
        };
    }
  }

  // ============================================
  // STARTER KIT FLOW HANDLER
  // ============================================

  static handleStarterFlow(lead: Lead, message: string): FlowResponse {
    const daysLeft = getDaysUntilSaleEnds();
    const checkoutUrl = PRODUCTS.starter.checkoutUrl!;

    switch (lead.currentStep) {
      case 'qualify_business':
        // Handle 1, 2, 3 response
        let valueMessage = MESSAGES.STARTER_VALUE_EXPLORING;
        let businessStage: Lead['businessStage'] = 'exploring';

        if (message === '1' || message.includes('new') || message.includes('start')) {
          valueMessage = MESSAGES.STARTER_VALUE_NEW_BIZ;
          businessStage = 'new';
        } else if (message === '2' || message.includes('better') || message.includes('exist')) {
          valueMessage = MESSAGES.STARTER_VALUE_REBRAND;
          businessStage = 'existing';
        }

        return {
          messages: [valueMessage, MESSAGES.STARTER_VALUE_STACK],
          nextStep: 'show_samples',
          updateLead: { businessStage, status: 'qualified' }
        };

      case 'show_samples':
        // Handle yes/no for samples
        if (message === 'yes' || message === 'y' || message.includes('yes') || message.includes('example')) {
          return {
            messages: [
              MESSAGES.STARTER_SAMPLES(CONFIG.PORTFOLIO_URL),
              MESSAGES.STARTER_CHECKOUT(checkoutUrl, daysLeft)
            ],
            nextStep: 'checkout',
            updateLead: { checkoutLinkSent: true }
          };
        }
        // No or ready to buy
        return {
          messages: [MESSAGES.STARTER_CHECKOUT(checkoutUrl, daysLeft)],
          nextStep: 'checkout',
          updateLead: { checkoutLinkSent: true }
        };

      case 'checkout':
      case 'objection_handling':
        // Handle objections or questions
        return this.handleObjection(lead, message, 'starter');

      default:
        return {
          messages: [MESSAGES.STARTER_WELCOME],
          nextStep: 'qualify_business'
        };
    }
  }

  // ============================================
  // LAUNCH KIT FLOW HANDLER
  // ============================================

  static handleLaunchFlow(lead: Lead, message: string): FlowResponse {
    const daysLeft = getDaysUntilSaleEnds();

    switch (lead.currentStep) {
      case 'qualify_business':
        // Handle 1, 2, 3 goal response
        let painPoint = 'curious';
        if (message === '1' || message.includes('camera') || message.includes('hate')) {
          painPoint = 'camera_shy';
        } else if (message === '2' || message.includes('scale')) {
          painPoint = 'scale';
        }

        return {
          messages: [MESSAGES.LAUNCH_INDUSTRY],
          nextStep: 'qualify_industry',
          updateLead: { painPoint }
        };

      case 'qualify_industry':
        // Handle industry selection
        const industries = [
          'Real Estate',
          'Coaching / Consulting',
          'Med Spa / Healthcare',
          'E-commerce / Retail',
          'Agency / Marketing',
          'Other'
        ];

        let industry = 'Other';
        const num = parseInt(message);
        if (num >= 1 && num <= 6) {
          industry = industries[num - 1];
        } else {
          // Try to match from text
          for (const ind of industries) {
            if (message.toLowerCase().includes(ind.toLowerCase().split(' ')[0].toLowerCase())) {
              industry = ind;
              break;
            }
          }
        }

        return {
          messages: [MESSAGES.LAUNCH_VOLUME(industry)],
          nextStep: 'qualify_volume',
          updateLead: { industry }
        };

      case 'qualify_volume':
        // Handle volume response
        let volumeMessage = MESSAGES.LAUNCH_VALUE_LOW_VOLUME;
        let volume: Lead['currentVideoVolume'] = '0-5';

        if (message === '2' || message.includes('5-15') || message.includes('okay')) {
          volumeMessage = MESSAGES.LAUNCH_VALUE_MED_VOLUME;
          volume = '5-15';
        } else if (message === '3' || message.includes('15') || message.includes('scale')) {
          volumeMessage = MESSAGES.LAUNCH_VALUE_HIGH_VOLUME;
          volume = '15+';
        }

        const sampleUrl = INDUSTRY_SAMPLES[lead.industry || 'Other'];

        return {
          messages: [
            volumeMessage,
            MESSAGES.LAUNCH_SAMPLE(lead.industry || 'your industry', sampleUrl)
          ],
          nextStep: 'value_stack',
          updateLead: { currentVideoVolume: volume }
        };

      case 'value_stack':
        // They've seen sample, pitch Calendly
        return {
          messages: [MESSAGES.LAUNCH_CALENDLY(CONFIG.CALENDLY_URL, daysLeft)],
          nextStep: 'calendly_pitch',
          updateLead: { calendarlyLinkSent: true, status: 'calendly_sent' }
        };

      case 'calendly_pitch':
      case 'objection_handling':
        return this.handleObjection(lead, message, 'launch');

      default:
        return {
          messages: [MESSAGES.LAUNCH_WELCOME],
          nextStep: 'qualify_business'
        };
    }
  }

  // ============================================
  // ENGINE FLOW HANDLER
  // ============================================

  static handleEngineFlow(lead: Lead, message: string): FlowResponse {
    const daysLeft = getDaysUntilSaleEnds();

    switch (lead.currentStep) {
      case 'qualify_business':
        // Handle pain point selection
        let painMessage = MESSAGES.ENGINE_PAIN_FALLOFF;
        let painPoint = 'falloff';

        if (message === '2' || message.includes('time')) {
          painMessage = MESSAGES.ENGINE_PAIN_NO_TIME;
          painPoint = 'no_time';
        } else if (message === '3' || message.includes('result')) {
          painMessage = MESSAGES.ENGINE_PAIN_NO_RESULTS;
          painPoint = 'no_results';
        } else if (message === '4' || message.includes('volume')) {
          painMessage = MESSAGES.ENGINE_PAIN_VOLUME;
          painPoint = 'volume';
        }

        return {
          messages: [painMessage, MESSAGES.ENGINE_VALUE_STACK],
          nextStep: 'value_stack',
          updateLead: { painPoint, status: 'qualified' }
        };

      case 'value_stack':
        // Pitch Calendly
        return {
          messages: [MESSAGES.ENGINE_CALENDLY(CONFIG.CALENDLY_URL, daysLeft)],
          nextStep: 'calendly_pitch',
          updateLead: { calendarlyLinkSent: true, status: 'calendly_sent' }
        };

      case 'calendly_pitch':
      case 'objection_handling':
        return this.handleObjection(lead, message, 'engine');

      default:
        return {
          messages: [MESSAGES.ENGINE_WELCOME],
          nextStep: 'qualify_business'
        };
    }
  }

  // ============================================
  // DISCOVERY FLOW HANDLER
  // ============================================

  static handleDiscoveryFlow(lead: Lead, message: string): FlowResponse {
    const daysLeft = getDaysUntilSaleEnds();

    switch (lead.currentStep) {
      case 'qualify_business':
        // Route to appropriate flow based on selection
        if (message === '1' || message.includes('starter') || message.includes('497')) {
          return this.startFlow(lead, 'starter');
        } else if (message === '2' || message.includes('video') || message.includes('spokesperson')) {
          return this.startFlow(lead, 'launch');
        } else if (message === '3' || message.includes('engine') || message.includes('monthly')) {
          return this.startFlow(lead, 'engine');
        } else if (message === '4' || message.includes('not sure') || message.includes('help')) {
          return {
            messages: [MESSAGES.DISCOVERY_BUDGET],
            nextStep: 'qualify_volume'
          };
        }

        // Show pricing overview
        return {
          messages: [MESSAGES.PRICING_OVERVIEW(daysLeft)],
          nextStep: 'value_stack'
        };

      case 'qualify_volume':
        // Starting fresh vs have brand
        if (message === '1' || message.includes('fresh') || message.includes('start')) {
          return this.startFlow(lead, 'starter');
        }
        return this.startFlow(lead, 'launch');

      default:
        return {
          messages: [MESSAGES.DISCOVERY_WELCOME],
          nextStep: 'qualify_business'
        };
    }
  }

  // ============================================
  // OBJECTION HANDLER
  // ============================================

  static handleObjection(lead: Lead, message: string, product: ProductTier): FlowResponse {
    const daysLeft = getDaysUntilSaleEnds();
    const p = PRODUCTS[product];
    const checkoutUrl = p.checkoutUrl || CONFIG.CALENDLY_URL;

    // Common objection patterns
    if (message.includes('expensive') || message.includes('cost') || message.includes('afford') || message.includes('budget')) {
      return {
        messages: [MESSAGES.OBJECTION_TOO_EXPENSIVE(product)],
        nextStep: 'objection_handling'
      };
    }

    if (message.includes('not ready') || message.includes('later') || message.includes('think')) {
      return {
        messages: [MESSAGES.OBJECTION_NOT_READY],
        nextStep: 'objection_handling'
      };
    }

    if (message.includes('fake') || message.includes('real') || message.includes('look')) {
      return {
        messages: [MESSAGES.OBJECTION_AI_LOOKS_FAKE],
        nextStep: 'objection_handling'
      };
    }

    if (message.includes("don't like") || message.includes('revision') || message.includes('change')) {
      return {
        messages: [MESSAGES.OBJECTION_WHAT_IF_DONT_LIKE],
        nextStep: 'objection_handling'
      };
    }

    if (message.includes('how long') || message.includes('delivery') || message.includes('time')) {
      return {
        messages: [MESSAGES.OBJECTION_HOW_LONG],
        nextStep: 'objection_handling'
      };
    }

    if (message.includes('sample') || message.includes('example') || message.includes('portfolio')) {
      return {
        messages: [`Check out our work here:\n\n🔗 ${CONFIG.PORTFOLIO_URL}\n\nLet me know what you think!`],
        nextStep: 'objection_handling'
      };
    }

    // If they say yes/ready/buy/book
    if (message.includes('yes') || message.includes('ready') || message.includes('buy') || message.includes('book') || message.includes('let') || message.includes('go')) {
      if (p.conversionType === 'checkout') {
        return {
          messages: [`Awesome! Here's your checkout link:\n\n🔗 ${checkoutUrl}\n\n⏰ Remember: 50% off ends in ${daysLeft} days!`],
          nextStep: 'completed',
          updateLead: { checkoutLinkSent: true }
        };
      } else {
        return {
          messages: [`Great! Book your call here:\n\n📅 ${CONFIG.CALENDLY_URL}\n\n⏰ Lock in 50% off before January 7th!`],
          nextStep: 'completed',
          updateLead: { calendarlyLinkSent: true, status: 'calendly_sent' }
        };
      }
    }

    // Default fallback
    return {
      messages: [MESSAGES.FALLBACK],
      nextStep: lead.currentStep
    };
  }

  // ============================================
  // COMMAND HANDLER
  // ============================================

  static handleCommand(command: string, lead: Lead): FlowResponse {
    const daysLeft = getDaysUntilSaleEnds();

    switch (command) {
      case '/start':
      case '/help':
        return {
          messages: [MESSAGES.CMD_HELP],
          nextStep: lead.currentStep
        };

      case '/pricing':
        return {
          messages: [MESSAGES.PRICING_OVERVIEW(daysLeft)],
          nextStep: 'value_stack'
        };

      case '/samples':
        return {
          messages: [`Check out our portfolio:\n\n🔗 ${CONFIG.PORTFOLIO_URL}\n\nWhich industry are you in? I can show you specific examples!`],
          nextStep: lead.currentStep
        };

      case '/book':
        return {
          messages: [`📅 Book your discovery call:\n\n${CONFIG.CALENDLY_URL}\n\n15 minutes. No pressure. Just seeing if we're a fit!`],
          nextStep: lead.currentStep,
          updateLead: { calendarlyLinkSent: true }
        };

      case '/sale':
        return {
          messages: [MESSAGES.CMD_SALE(daysLeft)],
          nextStep: lead.currentStep
        };

      case '/faq':
        return {
          messages: [MESSAGES.CMD_FAQ],
          nextStep: lead.currentStep
        };

      default:
        return {
          messages: [MESSAGES.CMD_HELP],
          nextStep: lead.currentStep
        };
    }
  }
}

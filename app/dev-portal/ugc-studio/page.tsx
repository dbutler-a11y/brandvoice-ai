'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  Copy,
  Check,
  Upload,
  Video,
  FileText,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Play,
  Clock,
  Zap,
  Target,
  MessageSquare,
  Image as ImageIcon,
  ArrowRight,
  CheckCircle2,
  Circle,
  Film,
  Clapperboard,
  Download,
  Eye,
  X,
  AlertCircle
} from 'lucide-react';

type ContentCategory = 'faq' | 'tips' | 'promo' | 'testimonial' | 'brand-story' | 'explainer';

interface UGCProject {
  id: string;
  name: string;
  category: ContentCategory;
  avatarImage: string;
  avatarImagePath: string; // Full path to the image in /public/images/ugc-avatars/
  veoPrompt: string;
  audioScript: string;
  onScreenText: string[];
  brollPrompts: string[];
  brollTiming: string;
  status: 'draft' | 'veo-ready' | 'video-generated' | 'capcut-ready' | 'complete';
}

// Image viewer modal component
function ImageViewerModal({
  isOpen,
  onClose,
  imagePath,
  imageName
}: {
  isOpen: boolean;
  onClose: () => void;
  imagePath: string;
  imageName: string;
}) {
  if (!isOpen) return null;

  const handleDownload = async () => {
    try {
      const response = await fetch(imagePath);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = imageName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      // Fallback: open in new tab
      window.open(imagePath, '_blank');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="relative max-w-4xl max-h-[90vh] w-full mx-4">
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
        >
          <X className="w-8 h-8" />
        </button>
        <div className="bg-gray-900 rounded-xl overflow-hidden border border-gray-700">
          <div className="relative aspect-[3/4] max-h-[70vh]">
            <Image
              src={imagePath}
              alt={imageName}
              fill
              className="object-contain"
              unoptimized
            />
          </div>
          <div className="p-4 flex items-center justify-between border-t border-gray-700">
            <span className="text-sm text-gray-400 font-mono">{imageName}</span>
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors text-sm font-medium"
            >
              <Download className="w-4 h-4" />
              Download Image
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const categoryInfo: Record<ContentCategory, { label: string; color: string; icon: string }> = {
  'faq': { label: 'FAQ', color: 'bg-blue-500', icon: '?' },
  'tips': { label: 'Tips/Educational', color: 'bg-green-500', icon: '!' },
  'promo': { label: 'Promotional', color: 'bg-orange-500', icon: '$' },
  'testimonial': { label: 'Testimonial', color: 'bg-purple-500', icon: '"' },
  'brand-story': { label: 'Brand Story', color: 'bg-pink-500', icon: '*' },
  'explainer': { label: 'Service/Explainer', color: 'bg-cyan-500', icon: 'i' },
};

// Pre-made prompts from recent uploads
const presetProjects: UGCProject[] = [
  {
    id: '1',
    name: 'Zenith Fitness - FAQ',
    category: 'faq',
    avatarImage: 'zenith-fitness-owner.png',
    avatarImagePath: '/images/ugc-avatars/zenith-fitness-owner.png',
    veoPrompt: `A confident fitness studio owner stands in her modern gym space, speaking directly to camera with warm energy. She's wearing a mauve athletic set with a black zip-up jacket, her honey-blonde waves falling naturally. Behind her, the "FITNESS" logo is visible on a clean reception desk. Natural morning light fills the space. She gestures naturally as she addresses a common question, her expression shifting from understanding to enthusiastic as she explains. Cinematic quality, 9:16 vertical format, 15 seconds. Subtle camera movement, shallow depth of field on her face.`,
    audioScript: `"I get this question all the time—do I really need a trainer if I already work out?" [slight pause, knowing smile] "Here's the thing: most people hit a plateau because they're doing the same routine. A good trainer doesn't just push you—they see what you can't. That's when real change happens."`,
    onScreenText: [
      '"Do I really need a trainer?"',
      'Most people plateau doing the same routine',
      'A trainer sees what you can\'t',
      'That\'s when REAL change happens'
    ],
    brollPrompts: [
      'Close-up of hands adjusting weight plates on a barbell, gym setting, warm lighting, 9:16 vertical, 3 seconds',
      'Person doing a perfect squat form from side angle, modern gym background, slow motion, 9:16 vertical, 3 seconds',
      'Trainer pointing at a workout chart on clipboard, shallow depth of field, 9:16 vertical, 2 seconds',
      'Triumphant fist pump after completing a set, sweat visible, motivational energy, 9:16 vertical, 2 seconds'
    ],
    brollTiming: 'Use B-roll #1 at 0:03-0:06 (during "plateau" mention), B-roll #2 at 0:08-0:10 (during "trainer sees"), B-roll #3/#4 optional for jump cuts',
    status: 'draft'
  },
  {
    id: '2',
    name: 'Maison Noir Boutique - Explainer',
    category: 'explainer',
    avatarImage: 'maison-noir-boutique.png',
    avatarImagePath: '/images/ugc-avatars/maison-noir-boutique.png',
    veoPrompt: `A stylish Latina boutique owner in a dark teal blazer over a tan fitted dress stands among clothing racks in a light-filled boutique. She's mid-motion, thoughtfully touching a garment on the rack as she speaks to camera with the confidence of someone who truly knows style. Potted plants and natural wood floors create a warm, curated atmosphere. She makes eye contact, gestures to the clothes around her, then back to camera with a welcoming smile. 9:16 vertical, 15 seconds, soft natural lighting, cinematic shallow focus.`,
    audioScript: `"Personal styling isn't about telling you what to wear." [touches a blouse on the rack] "It's about understanding your life—your meetings, your weekends, what makes you feel powerful." [looks to camera] "I build wardrobes that actually work. Book a session, and let's find your look."`,
    onScreenText: [
      'Personal styling isn\'t about rules',
      'It\'s about YOUR life',
      'Wardrobes that actually work',
      'Book your session'
    ],
    brollPrompts: [
      'Elegant hands sliding hangers across a clothing rack, soft fabrics visible, boutique lighting, 9:16 vertical, 3 seconds',
      'Close-up of designer fabric texture being touched, shallow depth of field, warm tones, 9:16 vertical, 2 seconds',
      'Woman confidently checking herself in mirror wearing new outfit, back view, natural light, 9:16 vertical, 3 seconds',
      'Neatly organized closet with color-coordinated clothes, satisfying aesthetic, 9:16 vertical, 2 seconds'
    ],
    brollTiming: 'Use B-roll #1 at 0:02-0:05 (during "telling you what to wear"), B-roll #2 at 0:06-0:08, B-roll #3 at 0:10-0:12 (during "powerful")',
    status: 'draft'
  },
  {
    id: '3',
    name: 'Goldenroot Coffee - Brand Story',
    category: 'brand-story',
    avatarImage: 'goldenroot-cafe-owner.png',
    avatarImagePath: '/images/ugc-avatars/goldenroot-cafe-owner.png',
    veoPrompt: `A joyful Black woman café owner stands at the entrance of her warm, plant-filled coffee shop during golden hour. She wears a brown apron over a black long-sleeve shirt, holding a perfectly crafted latte with heart art. Keys jingle softly in her other hand as she opens for the day. Her natural hair frames her beaming smile. The sunset light streams through the doorway, creating a magical glow. She speaks with genuine warmth about her journey, occasionally glancing at her café with pride. 9:16 vertical format, 15 seconds, cinematic warmth, intimate handheld feel.`,
    audioScript: `"Five years ago, this was just a dream and a lot of doubt." [looks around the café, then back to camera] "Now? This place is where people come to breathe. To talk. To just... be." [holds up coffee] "Every cup we pour carries that intention. Welcome to Goldenroot."`,
    onScreenText: [
      '5 years ago: just a dream',
      'Now: a place to breathe',
      'Every cup carries intention',
      'Welcome to Goldenroot'
    ],
    brollPrompts: [
      'Steaming coffee being poured into ceramic cup, close-up, warm café lighting, slow motion, 9:16 vertical, 3 seconds',
      'Cozy café interior with people chatting, soft focus, plants visible, golden hour light, 9:16 vertical, 3 seconds',
      'Barista hands creating latte art, top-down view, satisfying pour, 9:16 vertical, 3 seconds',
      'Keys unlocking a door at sunrise, hopeful mood, café entrance visible, 9:16 vertical, 2 seconds'
    ],
    brollTiming: 'Use B-roll #4 at 0:01-0:03 (during "dream"), B-roll #2 at 0:05-0:08 (during "breathe, talk, be"), B-roll #3 at 0:10-0:12 (during "every cup")',
    status: 'draft'
  },
  {
    id: '4',
    name: 'Verso Espresso - Promotional',
    category: 'promo',
    avatarImage: 'verso-espresso-owner.png',
    avatarImagePath: '/images/ugc-avatars/verso-espresso-owner.png',
    veoPrompt: `A handsome Mediterranean man with dark stubble stands confidently behind an espresso machine in a warm, amber-lit café. He wears a cream linen shirt over a black tee, arms relaxed on the wooden counter. Steam rises from the machine beside him. Bottles and warm lighting create a sophisticated backdrop. He speaks with quiet intensity about his craft, occasionally gesturing to the machine. His eyes are warm but focused—a man who takes his coffee seriously. 9:16 vertical, 15 seconds, rich warm tones, shallow depth of field, slight slow-motion on the steam.`,
    audioScript: `"We don't do complicated here." [taps the espresso machine] "Single origin. Perfectly pulled. No syrups, no gimmicks." [slight smile] "Just real coffee, made by someone who actually cares. First one's on us—come see what you've been missing."`,
    onScreenText: [
      'No syrups. No gimmicks.',
      'Single origin. Perfectly pulled.',
      'Made by someone who cares.',
      'First one\'s FREE'
    ],
    brollPrompts: [
      'Espresso shot pulling from machine, rich crema forming, extreme close-up, warm lighting, slow motion, 9:16 vertical, 3 seconds',
      'Coffee beans falling into grinder hopper, cascading motion, shallow depth of field, 9:16 vertical, 2 seconds',
      'Steam wand frothing milk, satisfying swirl, professional technique, 9:16 vertical, 3 seconds',
      'Hand sliding finished espresso across wooden counter toward camera, inviting gesture, 9:16 vertical, 2 seconds'
    ],
    brollTiming: 'Use B-roll #2 at 0:02-0:04 (during "single origin"), B-roll #1 at 0:05-0:08 (during "perfectly pulled"), B-roll #4 at 0:12-0:14 (during "first one\'s on us")',
    status: 'draft'
  },
];

export default function UGCStudioPage() {
  const [projects, setProjects] = useState<UGCProject[]>(presetProjects);
  const [activeProject, setActiveProject] = useState<UGCProject | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    workflow: true,
    prompts: true,
    capcut: false,
  });
  const [viewerImage, setViewerImage] = useState<{ path: string; name: string } | null>(null);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const copyToClipboard = (text: string, fieldId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const workflowSteps = [
    {
      step: 1,
      title: 'Select Avatar Image',
      description: 'Choose or upload your spokesperson image',
      icon: ImageIcon,
      action: 'Upload image to Veo 3 as reference'
    },
    {
      step: 2,
      title: 'Copy Veo 3 Prompt',
      description: 'Use the video generation prompt',
      icon: Sparkles,
      action: 'Paste prompt into Veo 3, generate 15-sec video'
    },
    {
      step: 3,
      title: 'Generate B-Roll',
      description: 'Create 2-4 supporting clips',
      icon: Film,
      action: 'Use B-roll prompts in Veo 3 (3-sec clips each)'
    },
    {
      step: 4,
      title: 'Generate Audio',
      description: 'Use ElevenLabs with the audio script',
      icon: MessageSquare,
      action: 'Copy script, generate voiceover in ElevenLabs'
    },
    {
      step: 5,
      title: 'Assemble in CapCut',
      description: 'Layer video + B-roll + audio + text',
      icon: Video,
      action: 'Import all assets, sync audio, layer B-roll at timestamps'
    },
    {
      step: 6,
      title: 'Final Export',
      description: '9:16 format, 15 seconds, viral-ready',
      icon: CheckCircle2,
      action: 'Export 1080x1920, check audio sync'
    },
  ];

  const capcutChecklist = [
    'Import main Veo 3 spokesperson video (9:16 vertical)',
    'Import all B-roll clips (2-4 clips)',
    'Import ElevenLabs voiceover audio',
    'Sync main audio to lip movements',
    'Layer B-roll clips at timestamps (see timing guide)',
    'B-roll goes on track ABOVE main video',
    'Add text overlay #1 at 0:00-0:03 (hook)',
    'Add text overlay #2 at 0:03-0:07',
    'Add text overlay #3 at 0:07-0:11',
    'Add text overlay #4 (CTA) at 0:11-0:15',
    'Add subtle zoom on main video (1.0x to 1.05x)',
    'Add slight movement to B-roll (ken burns effect)',
    'Add auto-captions (optional)',
    'Check total duration = 15 seconds',
    'Export: 1080x1920, 30fps, High Quality',
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-purple-400" />
            UGC Content Studio
          </h1>
          <p className="text-gray-400">
            Streamlined workflow for creating 15-second viral UGC videos
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-5 gap-4 mb-8">
          <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
            <div className="text-2xl font-bold text-purple-400">{projects.length}</div>
            <div className="text-sm text-gray-500">Projects Ready</div>
          </div>
          <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
            <div className="text-2xl font-bold text-green-400">15s</div>
            <div className="text-sm text-gray-500">Target Length</div>
          </div>
          <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
            <div className="text-2xl font-bold text-blue-400">9:16</div>
            <div className="text-sm text-gray-500">Aspect Ratio</div>
          </div>
          <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
            <div className="text-2xl font-bold text-yellow-400">2-4</div>
            <div className="text-sm text-gray-500">B-Roll Clips</div>
          </div>
          <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
            <div className="text-2xl font-bold text-orange-400">6</div>
            <div className="text-sm text-gray-500">Steps to Complete</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Workflow & Checklist */}
          <div className="lg:col-span-1 space-y-6">
            {/* Workflow Steps */}
            <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
              <button
                onClick={() => toggleSection('workflow')}
                className="w-full p-4 flex items-center justify-between hover:bg-gray-800/50 transition-colors"
              >
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-400" />
                  5-Step Workflow
                </h2>
                {expandedSections.workflow ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>

              {expandedSections.workflow && (
                <div className="p-4 pt-0 space-y-3">
                  {workflowSteps.map((item) => (
                    <div
                      key={item.step}
                      className={`p-3 rounded-lg border transition-all cursor-pointer ${
                        currentStep === item.step
                          ? 'bg-purple-900/30 border-purple-500'
                          : 'bg-gray-800/50 border-gray-700 hover:border-gray-600'
                      }`}
                      onClick={() => setCurrentStep(item.step)}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          currentStep === item.step ? 'bg-purple-500' : 'bg-gray-700'
                        }`}>
                          {item.step}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-sm">{item.title}</div>
                          <div className="text-xs text-gray-500 mt-1">{item.action}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* CapCut Checklist */}
            <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
              <button
                onClick={() => toggleSection('capcut')}
                className="w-full p-4 flex items-center justify-between hover:bg-gray-800/50 transition-colors"
              >
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Video className="w-5 h-5 text-cyan-400" />
                  CapCut Checklist
                </h2>
                {expandedSections.capcut ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>

              {expandedSections.capcut && (
                <div className="p-4 pt-0 space-y-2">
                  {capcutChecklist.map((item, idx) => (
                    <label key={idx} className="flex items-center gap-3 p-2 rounded hover:bg-gray-800/50 cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-purple-500 focus:ring-purple-500" />
                      <span className="text-sm text-gray-300">{item}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Middle & Right Columns - Projects */}
          <div className="lg:col-span-2 space-y-6">
            {/* Project Cards */}
            <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
              <div className="p-4 border-b border-gray-800">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Target className="w-5 h-5 text-pink-400" />
                  Ready-to-Use Projects
                </h2>
                <p className="text-sm text-gray-500 mt-1">Click any project to expand and copy prompts</p>
              </div>

              <div className="divide-y divide-gray-800">
                {projects.map((project) => (
                  <div key={project.id} className="p-4">
                    <button
                      onClick={() => setActiveProject(activeProject?.id === project.id ? null : project)}
                      className="w-full text-left"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${categoryInfo[project.category].color}`}>
                            {categoryInfo[project.category].label}
                          </span>
                          <span className="font-medium">{project.name}</span>
                        </div>
                        {activeProject?.id === project.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </div>
                    </button>

                    {activeProject?.id === project.id && (
                      <div className="mt-4 space-y-4">
                        {/* Avatar Image with Preview & Download */}
                        <div className="bg-gradient-to-r from-purple-900/40 to-pink-900/40 rounded-lg p-4 border border-purple-700/50">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="text-sm font-medium text-purple-300 flex items-center gap-2">
                              <ImageIcon className="w-4 h-4" />
                              Reference Avatar Image
                            </h3>
                            <span className="text-xs text-purple-400 bg-purple-900/50 px-2 py-1 rounded">Step 1: Upload to Veo 3</span>
                          </div>

                          <div className="flex gap-4">
                            {/* Image Preview Thumbnail */}
                            <div className="relative w-24 h-32 bg-gray-800 rounded-lg overflow-hidden border-2 border-dashed border-gray-600 flex-shrink-0">
                              {!imageErrors[project.id] ? (
                                <>
                                  <Image
                                    src={project.avatarImagePath}
                                    alt={project.avatarImage}
                                    fill
                                    className="object-cover"
                                    onError={() => setImageErrors(prev => ({ ...prev, [project.id]: true }))}
                                    unoptimized
                                  />
                                  <button
                                    onClick={() => setViewerImage({ path: project.avatarImagePath, name: project.avatarImage })}
                                    className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center"
                                  >
                                    <Eye className="w-6 h-6 text-white" />
                                  </button>
                                </>
                              ) : (
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500 p-2">
                                  <AlertCircle className="w-6 h-6 mb-1" />
                                  <span className="text-[10px] text-center">Image not uploaded yet</span>
                                </div>
                              )}
                            </div>

                            {/* Image Info & Actions */}
                            <div className="flex-1 flex flex-col justify-between">
                              <div>
                                <p className="text-sm text-white font-medium mb-1">{project.avatarImage}</p>
                                <p className="text-xs text-gray-400 mb-3">
                                  Upload this reference image to Veo 3 when generating the video
                                </p>
                              </div>

                              <div className="flex gap-2">
                                {!imageErrors[project.id] ? (
                                  <>
                                    <button
                                      onClick={() => setViewerImage({ path: project.avatarImagePath, name: project.avatarImage })}
                                      className="flex items-center gap-1.5 px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-sm"
                                    >
                                      <Eye className="w-4 h-4" />
                                      View Full
                                    </button>
                                    <a
                                      href={project.avatarImagePath}
                                      download={project.avatarImage}
                                      className="flex items-center gap-1.5 px-3 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors text-sm"
                                    >
                                      <Download className="w-4 h-4" />
                                      Download
                                    </a>
                                  </>
                                ) : (
                                  <div className="flex items-center gap-2 text-yellow-500 text-sm">
                                    <AlertCircle className="w-4 h-4" />
                                    <span>Upload image to: <code className="text-xs bg-gray-800 px-1 py-0.5 rounded">{project.avatarImagePath}</code></span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Veo 3 Prompt */}
                        <div className="bg-gray-800 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-medium text-gray-400 flex items-center gap-2">
                              <Sparkles className="w-4 h-4" />
                              Veo 3 Video Prompt
                            </h3>
                            <button
                              onClick={() => copyToClipboard(project.veoPrompt, `veo-${project.id}`)}
                              className="flex items-center gap-1 text-xs bg-purple-600 hover:bg-purple-700 px-3 py-1 rounded transition-colors"
                            >
                              {copiedField === `veo-${project.id}` ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                              {copiedField === `veo-${project.id}` ? 'Copied!' : 'Copy'}
                            </button>
                          </div>
                          <p className="text-sm text-gray-300 leading-relaxed">{project.veoPrompt}</p>
                        </div>

                        {/* Audio Script */}
                        <div className="bg-gray-800 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-medium text-gray-400 flex items-center gap-2">
                              <MessageSquare className="w-4 h-4" />
                              Audio Script (ElevenLabs)
                            </h3>
                            <button
                              onClick={() => copyToClipboard(project.audioScript, `audio-${project.id}`)}
                              className="flex items-center gap-1 text-xs bg-green-600 hover:bg-green-700 px-3 py-1 rounded transition-colors"
                            >
                              {copiedField === `audio-${project.id}` ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                              {copiedField === `audio-${project.id}` ? 'Copied!' : 'Copy'}
                            </button>
                          </div>
                          <p className="text-sm text-gray-300 leading-relaxed italic">{project.audioScript}</p>
                        </div>

                        {/* On-Screen Text */}
                        <div className="bg-gray-800 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-medium text-gray-400 flex items-center gap-2">
                              <FileText className="w-4 h-4" />
                              On-Screen Text Overlays
                            </h3>
                            <button
                              onClick={() => copyToClipboard(project.onScreenText.join('\n'), `text-${project.id}`)}
                              className="flex items-center gap-1 text-xs bg-cyan-600 hover:bg-cyan-700 px-3 py-1 rounded transition-colors"
                            >
                              {copiedField === `text-${project.id}` ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                              {copiedField === `text-${project.id}` ? 'Copied!' : 'Copy All'}
                            </button>
                          </div>
                          <div className="space-y-2">
                            {project.onScreenText.map((text, idx) => (
                              <div key={idx} className="flex items-center gap-2">
                                <span className="text-xs text-gray-500 w-16">0:{String(idx * 4).padStart(2, '0')}-0:{String((idx + 1) * 4).padStart(2, '0')}</span>
                                <span className="text-sm text-white bg-gray-700 px-2 py-1 rounded">{text}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* B-Roll Prompts */}
                        <div className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 rounded-lg p-4 border border-yellow-700/50">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="text-sm font-medium text-yellow-400 flex items-center gap-2">
                              <Film className="w-4 h-4" />
                              B-Roll Prompts (Veo 3)
                            </h3>
                            <button
                              onClick={() => copyToClipboard(project.brollPrompts.join('\n\n'), `broll-${project.id}`)}
                              className="flex items-center gap-1 text-xs bg-yellow-600 hover:bg-yellow-700 px-3 py-1 rounded transition-colors"
                            >
                              {copiedField === `broll-${project.id}` ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                              {copiedField === `broll-${project.id}` ? 'Copied!' : 'Copy All'}
                            </button>
                          </div>
                          <div className="space-y-3">
                            {project.brollPrompts.map((prompt, idx) => (
                              <div key={idx} className="flex items-start gap-2">
                                <span className="text-xs font-bold text-yellow-500 bg-yellow-900/50 px-2 py-1 rounded flex-shrink-0">
                                  B{idx + 1}
                                </span>
                                <div className="flex-1 flex items-start justify-between gap-2">
                                  <span className="text-sm text-gray-300">{prompt}</span>
                                  <button
                                    onClick={() => copyToClipboard(prompt, `broll-${project.id}-${idx}`)}
                                    className="flex-shrink-0 text-yellow-500 hover:text-yellow-400"
                                  >
                                    {copiedField === `broll-${project.id}-${idx}` ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* B-Roll Timing Guide */}
                          <div className="mt-4 pt-3 border-t border-yellow-700/30">
                            <h4 className="text-xs font-medium text-yellow-500 mb-2 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              TIMING GUIDE
                            </h4>
                            <p className="text-xs text-gray-400">{project.brollTiming}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Tips */}
            <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-xl border border-purple-700/50 p-6">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-400" />
                Viral Content Tips
              </h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-start gap-2">
                  <ArrowRight className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                  <span><strong>Hook in first 2 seconds</strong> - Start with a question or bold statement</span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                  <span><strong>Text must be readable</strong> - Large font, high contrast, 3-5 words max per overlay</span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                  <span><strong>Audio sync is critical</strong> - Lip movements should match voiceover timing</span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                  <span><strong>End with clear CTA</strong> - Tell them exactly what to do next</span>
                </li>
              </ul>
            </div>

            {/* B-Roll Tips */}
            <div className="bg-gradient-to-r from-yellow-900/50 to-orange-900/50 rounded-xl border border-yellow-700/50 p-6">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Film className="w-5 h-5 text-yellow-400" />
                B-Roll Best Practices
              </h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-start gap-2">
                  <ArrowRight className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                  <span><strong>2-4 second clips max</strong> - Quick cuts keep attention, don&apos;t linger</span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                  <span><strong>Illustrate, don&apos;t distract</strong> - B-roll should support what&apos;s being said</span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                  <span><strong>Match the lighting</strong> - Keep B-roll in same color temperature as main video</span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                  <span><strong>Use for lip-sync fixes</strong> - Cut to B-roll when audio doesn&apos;t match perfectly</span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                  <span><strong>Add subtle motion</strong> - Ken Burns effect (slow zoom/pan) on still B-roll</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Image Viewer Modal */}
      {viewerImage && (
        <ImageViewerModal
          isOpen={!!viewerImage}
          onClose={() => setViewerImage(null)}
          imagePath={viewerImage.path}
          imageName={viewerImage.name}
        />
      )}
    </div>
  );
}

'use client'

import { useState } from 'react'
import { Copy, Check, Plus, Trash2, Edit2, Save, X, Film, Video, Sparkles } from 'lucide-react'

interface Prompt {
  id: string
  avatar: string
  scriptName: string
  voiceover: string
  wan26Prompt: string
  veo31Prompt: string
  brollPrompts: string[]
  duration: string
  status: 'draft' | 'tested' | 'approved'
  notes: string
}

// Initial prompts data
const initialPrompts: Prompt[] = [
  // ====== FITNESS STUDIO OWNER (Zenith Fitness) ======
  {
    id: '1',
    avatar: 'Fitness Studio Owner',
    scriptName: '30 Minute Truth',
    voiceover: "Everyone says they don't have time for fitness. Here's the truth - 30 minutes, three times a week, changes everything. That's less time than you spend scrolling. Ready to feel different? Link in bio.",
    wan26Prompt: "Athletic European woman speaking to camera in modern fitness studio. Opens with tight close-up on face, direct eye contact, serious tone. Camera slowly pulls back revealing gym environment. Mid-video: cut to medium shot from different angle, she gestures expressively with hands. Final moments: wider shot showing full upper body, confident smile, slight forward lean toward camera. Natural movement throughout, professional gym lighting, energetic but grounded delivery. Continuous speech synced to audio. 15 seconds.",
    veo31Prompt: "Athletic woman in modern gym speaking directly to camera. Close-up face shot, intense eye contact, subtle head movements. Professional lighting, shallow depth of field on gym equipment background. Confident, motivating energy. 8 seconds.",
    brollPrompts: [
      "Quick cuts of fitness studio action. Dumbbells being racked. Hands gripping barbell. Feet on treadmill. Water bottle being grabbed. Kettlebell swing in motion. Timer counting down. High five between trainer and client. Modern gym aesthetic, warm lighting, energetic pace. No people's faces. 5-8 seconds.",
      "Cinematic slow pan across empty modern fitness studio at golden hour. Sunlight streaming through windows onto equipment. Pristine dumbbells in rack. Clean yoga mats stacked. Motivational wall art slightly out of focus. Premium boutique gym aesthetic. Calm before the workout energy. 5-8 seconds."
    ],
    duration: '15 sec',
    status: 'draft',
    notes: 'Multi-scene with camera pulls and angle changes'
  },
  {
    id: '2',
    avatar: 'Fitness Studio Owner',
    scriptName: 'The Excuse Everyone Uses',
    voiceover: "I'll start Monday. I'm too out of shape. I don't know what I'm doing. Sound familiar? Every successful client started with those exact excuses. The difference? They showed up anyway. Your turn.",
    wan26Prompt: "Confident female fitness trainer in bright modern gym, speaking directly to camera. Begins with medium shot, knowing smirk, listing excuses. Quick transition to close-up as tone shifts to empathetic. Camera movement creates energy - slight push in during 'showed up anyway.' Final beat: pulls to wider angle, she crosses arms confidently, warm encouraging expression. Dynamic scene changes maintain attention. Lip-synced to voiceover, 15 seconds.",
    veo31Prompt: "Female fitness trainer in gym, medium shot transitioning to close-up. Knowing expression shifts to empathetic then confident. Subtle camera push in. Warm professional lighting. Motivational delivery. 8 seconds.",
    brollPrompts: [
      "Montage of workout preparation. Lacing up sneakers. Putting in earbuds. Filling water bottle. Hand pressing start on treadmill. Clock showing early morning. Gym bag being packed. Determination energy. 5-8 seconds."
    ],
    duration: '15 sec',
    status: 'draft',
    notes: 'Emotional tone shift mid-video'
  },
  {
    id: '3',
    avatar: 'Fitness Studio Owner',
    scriptName: 'Do I Really Need a Trainer?',
    voiceover: "I get this question all the time—do I really need a trainer if I already work out? Here's the thing: most people hit a plateau because they're doing the same routine. A good trainer doesn't just push you—they see what you can't. That's when real change happens.",
    wan26Prompt: "A confident fitness studio owner stands in her modern gym space, speaking directly to camera with warm energy. She's wearing a mauve athletic set with a black zip-up jacket, her honey-blonde waves falling naturally. Behind her, the FITNESS logo is visible on a clean reception desk. Natural morning light fills the space. She gestures naturally as she addresses a common question, her expression shifting from understanding to enthusiastic as she explains. Cinematic quality, 9:16 vertical format, 15 seconds. Subtle camera movement, shallow depth of field on her face.",
    veo31Prompt: "Fitness studio owner in modern gym, medium shot. Understanding expression shifting to enthusiastic as she explains. Natural morning light, reception desk background. Professional but warm energy. 8 seconds.",
    brollPrompts: [
      "Close-up of hands adjusting weight plates on a barbell, gym setting, warm lighting, 9:16 vertical, 3 seconds",
      "Person doing a perfect squat form from side angle, modern gym background, slow motion, 9:16 vertical, 3 seconds",
      "Trainer pointing at a workout chart on clipboard, shallow depth of field, 9:16 vertical, 2 seconds"
    ],
    duration: '15 sec',
    status: 'draft',
    notes: 'FAQ format - addresses common objection'
  },

  // ====== BOUTIQUE OWNER (Maison Noir) ======
  {
    id: '4',
    avatar: 'Boutique Owner',
    scriptName: 'Personal Styling Truth',
    voiceover: "Personal styling isn't about telling you what to wear. It's about understanding your life—your meetings, your weekends, what makes you feel powerful. I build wardrobes that actually work. Book a session, and let's find your look.",
    wan26Prompt: "A stylish Latina boutique owner in a dark teal blazer over a tan fitted dress stands among clothing racks in a light-filled boutique. She's mid-motion, thoughtfully touching a garment on the rack as she speaks to camera with the confidence of someone who truly knows style. Potted plants and natural wood floors create a warm, curated atmosphere. She makes eye contact, gestures to the clothes around her, then back to camera with a welcoming smile. 9:16 vertical, 15 seconds, soft natural lighting, cinematic shallow focus.",
    veo31Prompt: "Stylish Latina boutique owner among clothing racks, touching garments while speaking. Dark teal blazer, tan dress. Soft natural lighting, plants in background. Confident, welcoming energy. 8 seconds.",
    brollPrompts: [
      "Elegant hands sliding hangers across a clothing rack, soft fabrics visible, boutique lighting, 9:16 vertical, 3 seconds",
      "Close-up of designer fabric texture being touched, shallow depth of field, warm tones, 9:16 vertical, 2 seconds",
      "Woman confidently checking herself in mirror wearing new outfit, back view, natural light, 9:16 vertical, 3 seconds",
      "Neatly organized closet with color-coordinated clothes, satisfying aesthetic, 9:16 vertical, 2 seconds"
    ],
    duration: '15 sec',
    status: 'draft',
    notes: 'Explainer format - service explanation'
  },
  {
    id: '5',
    avatar: 'Boutique Owner',
    scriptName: 'The Capsule Wardrobe Secret',
    voiceover: "Want to know the secret to looking put-together every single day? It's not about having MORE clothes. It's about having the RIGHT pieces that work together. Twenty items. Endless outfits. Let me show you how.",
    wan26Prompt: "Elegant Latina woman in upscale boutique, speaking directly to camera. Opens medium shot showing stylish outfit. Gestures to clothing around her as she speaks. Mid-video: camera moves to show organized rack of coordinated pieces. Final shot: close-up warm smile, slight head tilt, inviting energy. Natural boutique lighting, sophisticated atmosphere. 15 seconds.",
    veo31Prompt: "Boutique owner surrounded by curated clothing, medium shot. Gestures to coordinated pieces while explaining concept. Natural lighting, sophisticated setting. Confident, educational tone. 8 seconds.",
    brollPrompts: [
      "Overhead shot of capsule wardrobe laid out on bed. Neutral tones, quality fabrics visible. Satisfying organized aesthetic. 5 seconds.",
      "Hands mixing and matching outfit combinations. Blazer paired with different bottoms. Quick cuts showing versatility. 5 seconds."
    ],
    duration: '15 sec',
    status: 'draft',
    notes: 'Educational hook - capsule wardrobe concept'
  },

  // ====== CAFÉ OWNER - WOMAN (Goldenroot Coffee) ======
  {
    id: '6',
    avatar: 'Café Owner (Woman)',
    scriptName: 'Five Years Ago',
    voiceover: "Five years ago, this was just a dream and a lot of doubt. Now? This place is where people come to breathe. To talk. To just... be. Every cup we pour carries that intention. Welcome to Goldenroot.",
    wan26Prompt: "A joyful Black woman café owner stands at the entrance of her warm, plant-filled coffee shop during golden hour. She wears a brown apron over a black long-sleeve shirt, holding a perfectly crafted latte with heart art. Keys jingle softly in her other hand as she opens for the day. Her natural hair frames her beaming smile. The sunset light streams through the doorway, creating a magical glow. She speaks with genuine warmth about her journey, occasionally glancing at her café with pride. 9:16 vertical format, 15 seconds, cinematic warmth, intimate handheld feel.",
    veo31Prompt: "Black woman café owner at coffee shop entrance, golden hour. Brown apron, holding latte. Warm genuine smile, looking around space with pride. Magical sunset lighting. Intimate, emotional delivery. 8 seconds.",
    brollPrompts: [
      "Steaming coffee being poured into ceramic cup, close-up, warm café lighting, slow motion, 9:16 vertical, 3 seconds",
      "Cozy café interior with people chatting, soft focus, plants visible, golden hour light, 9:16 vertical, 3 seconds",
      "Barista hands creating latte art, top-down view, satisfying pour, 9:16 vertical, 3 seconds",
      "Keys unlocking a door at sunrise, hopeful mood, café entrance visible, 9:16 vertical, 2 seconds"
    ],
    duration: '15 sec',
    status: 'draft',
    notes: 'Brand story - emotional founder journey'
  },
  {
    id: '7',
    avatar: 'Café Owner (Woman)',
    scriptName: 'Morning Ritual',
    voiceover: "The best part of my day? 5:47 AM. Before the first customer. When it's just me and the espresso machine. That quiet moment before the magic starts. That's what I want you to feel when you walk in here.",
    wan26Prompt: "Black woman café owner in early morning quiet café. Soft pre-dawn light through windows. Close-up of her hands on espresso machine. Medium shot of peaceful expression, slight smile. Steam rising. Camera slowly reveals empty café behind her. Intimate, meditative energy. Natural movements, no rush. 15 seconds.",
    veo31Prompt: "Café owner alone in quiet coffee shop, early morning. Soft lighting, steam rising. Peaceful contemplative expression. Intimate close-up moments. Meditative energy. 8 seconds.",
    brollPrompts: [
      "Espresso machine warming up, steam rising, close-up details. Empty café in background. Pre-dawn blue light. 4 seconds.",
      "Hands wiping down counter in meditative motion. Morning preparation ritual. Calm energy. 4 seconds."
    ],
    duration: '15 sec',
    status: 'draft',
    notes: 'Emotional brand story - behind the scenes'
  },

  // ====== CAFÉ OWNER - MAN (Verso Espresso) ======
  {
    id: '8',
    avatar: 'Café Owner (Man)',
    scriptName: 'No Gimmicks',
    voiceover: "We don't do complicated here. Single origin. Perfectly pulled. No syrups, no gimmicks. Just real coffee, made by someone who actually cares. First one's on us—come see what you've been missing.",
    wan26Prompt: "A handsome Mediterranean man with dark stubble stands confidently behind an espresso machine in a warm, amber-lit café. He wears a cream linen shirt over a black tee, arms relaxed on the wooden counter. Steam rises from the machine beside him. Bottles and warm lighting create a sophisticated backdrop. He speaks with quiet intensity about his craft, occasionally gesturing to the machine. His eyes are warm but focused—a man who takes his coffee seriously. 9:16 vertical, 15 seconds, rich warm tones, shallow depth of field, slight slow-motion on the steam.",
    veo31Prompt: "Mediterranean man behind espresso machine, amber lighting. Cream linen shirt, confident stance. Speaks with quiet intensity. Steam rising, sophisticated café backdrop. Warm but focused energy. 8 seconds.",
    brollPrompts: [
      "Espresso shot pulling from machine, rich crema forming, extreme close-up, warm lighting, slow motion, 9:16 vertical, 3 seconds",
      "Coffee beans falling into grinder hopper, cascading motion, shallow depth of field, 9:16 vertical, 2 seconds",
      "Steam wand frothing milk, satisfying swirl, professional technique, 9:16 vertical, 3 seconds",
      "Hand sliding finished espresso across wooden counter toward camera, inviting gesture, 9:16 vertical, 2 seconds"
    ],
    duration: '15 sec',
    status: 'draft',
    notes: 'Promotional - free offer CTA'
  },
  {
    id: '9',
    avatar: 'Café Owner (Man)',
    scriptName: 'The Perfect Shot',
    voiceover: "Everyone wants the perfect shot. But here's what they don't tell you—it's not about the machine. It's not about the beans. It's about the 15 seconds of patience while it extracts. That's where the magic happens. Most people rush it.",
    wan26Prompt: "Mediterranean café owner at espresso machine, teaching moment. Opens close on his hands working the machine. Pull back to medium shot, he looks at camera with knowing expression. Speaks with passionate intensity. Close-up of espresso extracting. Returns to his face, slight satisfied nod. Warm amber lighting throughout. 15 seconds.",
    veo31Prompt: "Café owner at espresso machine, educational delivery. Hands working equipment, passionate expression. Close-up of extraction. Warm lighting, sophisticated setting. Expert energy. 8 seconds.",
    brollPrompts: [
      "Extreme close-up espresso extraction, timer visible, crema forming. Perfect technique showcase. 5 seconds.",
      "Hands tamping coffee grounds with precision. Professional technique. Shallow depth of field. 3 seconds."
    ],
    duration: '15 sec',
    status: 'draft',
    notes: 'Educational - expertise showcase'
  },

  // ====== FOOD TRUCK OWNER ======
  {
    id: '10',
    avatar: 'Food Truck Owner',
    scriptName: 'Secret Menu Hook',
    voiceover: "POV: You just discovered our secret menu item. Most people walk right past. But YOU? You know. The spicy mango fusion bowl. Only for those who ask. Now you're one of us. Come find us.",
    wan26Prompt: "Latina woman in food truck window, warm golden hour lighting. Opens with excited close-up, eyebrows raised conspiratorially. Leans in closer to camera like sharing a secret. Mid-video: pulls back showing colorful food truck interior, she gestures toward menu. Final shot: knowing smile, slight head tilt, beckoning gesture. Street food festival atmosphere, authentic energy. Lip-synced, 15 seconds.",
    veo31Prompt: "Friendly Latina food truck owner at service window, conspiratorial excited expression. Golden hour lighting, colorful truck background. Leans toward camera sharing secret. Warm authentic energy. 8 seconds.",
    brollPrompts: [
      "Close-up food preparation shots. Colorful ingredients being tossed in pan. Sauce drizzling. Steam rising. Hands assembling bowl. Fresh cilantro garnish. Vibrant colors, appetizing angles. 5-8 seconds.",
      "Food truck exterior establishing shot. String lights, customers waiting, urban setting. Pan across menu board. Evening street food market atmosphere. 5-8 seconds."
    ],
    duration: '15 sec',
    status: 'draft',
    notes: 'POV style, conspiratorial energy'
  }
]

export default function UGCPromptsPage() {
  const [prompts, setPrompts] = useState<Prompt[]>(initialPrompts)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [filterAvatar, setFilterAvatar] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [showAddForm, setShowAddForm] = useState(false)
  const [newPrompt, setNewPrompt] = useState<Partial<Prompt>>({
    avatar: '',
    scriptName: '',
    voiceover: '',
    wan26Prompt: '',
    veo31Prompt: '',
    brollPrompts: [''],
    duration: '15 sec',
    status: 'draft',
    notes: ''
  })

  const avatars = [...new Set(prompts.map(p => p.avatar))]

  const filteredPrompts = prompts.filter(p => {
    if (filterAvatar !== 'all' && p.avatar !== filterAvatar) return false
    if (filterStatus !== 'all' && p.status !== filterStatus) return false
    return true
  })

  const copyToClipboard = async (text: string, id: string, type: string) => {
    await navigator.clipboard.writeText(text)
    setCopiedId(`${id}-${type}`)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const updatePromptStatus = (id: string, status: Prompt['status']) => {
    setPrompts(prompts.map(p => p.id === id ? { ...p, status } : p))
  }

  const deletePrompt = (id: string) => {
    if (confirm('Delete this prompt?')) {
      setPrompts(prompts.filter(p => p.id !== id))
    }
  }

  const addNewPrompt = () => {
    if (!newPrompt.avatar || !newPrompt.scriptName) return
    const prompt: Prompt = {
      id: Date.now().toString(),
      avatar: newPrompt.avatar || '',
      scriptName: newPrompt.scriptName || '',
      voiceover: newPrompt.voiceover || '',
      wan26Prompt: newPrompt.wan26Prompt || '',
      veo31Prompt: newPrompt.veo31Prompt || '',
      brollPrompts: newPrompt.brollPrompts?.filter(b => b.trim()) || [],
      duration: newPrompt.duration || '15 sec',
      status: 'draft',
      notes: newPrompt.notes || ''
    }
    setPrompts([...prompts, prompt])
    setNewPrompt({
      avatar: '',
      scriptName: '',
      voiceover: '',
      wan26Prompt: '',
      veo31Prompt: '',
      brollPrompts: [''],
      duration: '15 sec',
      status: 'draft',
      notes: ''
    })
    setShowAddForm(false)
  }

  const statusColors = {
    draft: 'bg-gray-100 text-gray-700',
    tested: 'bg-yellow-100 text-yellow-700',
    approved: 'bg-green-100 text-green-700'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">UGC Prompt Manager</h1>
          <p className="text-gray-600 mt-1">Manage Wan 2.6 & Veo 3.1 prompts for UGC viral clips</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Prompt
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 p-4 bg-gray-50 rounded-lg">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Avatar</label>
          <select
            value={filterAvatar}
            onChange={(e) => setFilterAvatar(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Avatars</option>
            {avatars.map(a => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="tested">Tested</option>
            <option value="approved">Approved</option>
          </select>
        </div>
        <div className="flex items-end">
          <span className="text-sm text-gray-500">{filteredPrompts.length} prompts</span>
        </div>
      </div>

      {/* Add Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Add New Prompt</h2>
              <button onClick={() => setShowAddForm(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Avatar</label>
                  <input
                    type="text"
                    value={newPrompt.avatar}
                    onChange={(e) => setNewPrompt({ ...newPrompt, avatar: e.target.value })}
                    placeholder="e.g., Fitness Studio Owner"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Script Name</label>
                  <input
                    type="text"
                    value={newPrompt.scriptName}
                    onChange={(e) => setNewPrompt({ ...newPrompt, scriptName: e.target.value })}
                    placeholder="e.g., 30 Minute Truth"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Voiceover Script</label>
                <textarea
                  value={newPrompt.voiceover}
                  onChange={(e) => setNewPrompt({ ...newPrompt, voiceover: e.target.value })}
                  rows={3}
                  placeholder="The voiceover script..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <span className="flex items-center gap-2">
                    <Film className="w-4 h-4 text-purple-600" />
                    Wan 2.6 I2V Prompt (15 sec multi-scene)
                  </span>
                </label>
                <textarea
                  value={newPrompt.wan26Prompt}
                  onChange={(e) => setNewPrompt({ ...newPrompt, wan26Prompt: e.target.value })}
                  rows={4}
                  placeholder="Detailed multi-scene prompt for Wan 2.6..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                    Veo 3.1 Prompt (8 sec)
                  </span>
                </label>
                <textarea
                  value={newPrompt.veo31Prompt}
                  onChange={(e) => setNewPrompt({ ...newPrompt, veo31Prompt: e.target.value })}
                  rows={3}
                  placeholder="Shorter prompt optimized for Veo 3.1..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <span className="flex items-center gap-2">
                    <Video className="w-4 h-4 text-orange-600" />
                    B-Roll Prompts (T2V)
                  </span>
                </label>
                {newPrompt.brollPrompts?.map((broll, idx) => (
                  <div key={idx} className="flex gap-2 mb-2">
                    <textarea
                      value={broll}
                      onChange={(e) => {
                        const updated = [...(newPrompt.brollPrompts || [])]
                        updated[idx] = e.target.value
                        setNewPrompt({ ...newPrompt, brollPrompts: updated })
                      }}
                      rows={2}
                      placeholder={`B-roll prompt ${idx + 1}...`}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={() => {
                        const updated = newPrompt.brollPrompts?.filter((_, i) => i !== idx)
                        setNewPrompt({ ...newPrompt, brollPrompts: updated })
                      }}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => setNewPrompt({ ...newPrompt, brollPrompts: [...(newPrompt.brollPrompts || []), ''] })}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  + Add B-Roll Prompt
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <input
                  type="text"
                  value={newPrompt.notes}
                  onChange={(e) => setNewPrompt({ ...newPrompt, notes: e.target.value })}
                  placeholder="Any notes about this prompt..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={addNewPrompt}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Prompt
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Prompts List */}
      <div className="space-y-6">
        {filteredPrompts.map((prompt) => (
          <div key={prompt.id} className="bg-white rounded-xl shadow-md overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-purple-200 text-sm">{prompt.avatar}</span>
                  <h3 className="text-xl font-bold">{prompt.scriptName}</h3>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[prompt.status]}`}>
                    {prompt.status.toUpperCase()}
                  </span>
                  <span className="text-sm bg-white/20 px-3 py-1 rounded-full">{prompt.duration}</span>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Voiceover */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                    🎙️ Voiceover Script
                  </h4>
                  <button
                    onClick={() => copyToClipboard(prompt.voiceover, prompt.id, 'voiceover')}
                    className="text-gray-500 hover:text-blue-600 p-1"
                  >
                    {copiedId === `${prompt.id}-voiceover` ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-gray-700 bg-gray-50 p-3 rounded-lg text-sm">{prompt.voiceover}</p>
              </div>

              {/* Wan 2.6 Prompt */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Film className="w-4 h-4 text-purple-600" />
                    Wan 2.6 I2V Prompt (15 sec multi-scene)
                  </h4>
                  <button
                    onClick={() => copyToClipboard(prompt.wan26Prompt, prompt.id, 'wan26')}
                    className="text-gray-500 hover:text-blue-600 p-1"
                  >
                    {copiedId === `${prompt.id}-wan26` ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-gray-700 bg-purple-50 p-3 rounded-lg text-sm border border-purple-100">
                  {prompt.wan26Prompt}
                </p>
              </div>

              {/* Veo 3.1 Prompt */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                    Veo 3.1 Prompt (8 sec)
                  </h4>
                  <button
                    onClick={() => copyToClipboard(prompt.veo31Prompt, prompt.id, 'veo31')}
                    className="text-gray-500 hover:text-blue-600 p-1"
                  >
                    {copiedId === `${prompt.id}-veo31` ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-gray-700 bg-blue-50 p-3 rounded-lg text-sm border border-blue-100">
                  {prompt.veo31Prompt}
                </p>
              </div>

              {/* B-Roll Prompts */}
              {prompt.brollPrompts.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 flex items-center gap-2 mb-2">
                    <Video className="w-4 h-4 text-orange-600" />
                    B-Roll Prompts (T2V)
                  </h4>
                  <div className="space-y-2">
                    {prompt.brollPrompts.map((broll, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <p className="flex-1 text-gray-700 bg-orange-50 p-3 rounded-lg text-sm border border-orange-100">
                          {broll}
                        </p>
                        <button
                          onClick={() => copyToClipboard(broll, prompt.id, `broll-${idx}`)}
                          className="text-gray-500 hover:text-blue-600 p-1 mt-2"
                        >
                          {copiedId === `${prompt.id}-broll-${idx}` ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes */}
              {prompt.notes && (
                <div className="text-sm text-gray-500 italic">
                  📝 {prompt.notes}
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex gap-2">
                  <button
                    onClick={() => updatePromptStatus(prompt.id, 'draft')}
                    className={`px-3 py-1 text-xs rounded-full transition-colors ${
                      prompt.status === 'draft' ? 'bg-gray-200 text-gray-800' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                    }`}
                  >
                    Draft
                  </button>
                  <button
                    onClick={() => updatePromptStatus(prompt.id, 'tested')}
                    className={`px-3 py-1 text-xs rounded-full transition-colors ${
                      prompt.status === 'tested' ? 'bg-yellow-200 text-yellow-800' : 'bg-gray-100 text-gray-500 hover:bg-yellow-100'
                    }`}
                  >
                    Tested
                  </button>
                  <button
                    onClick={() => updatePromptStatus(prompt.id, 'approved')}
                    className={`px-3 py-1 text-xs rounded-full transition-colors ${
                      prompt.status === 'approved' ? 'bg-green-200 text-green-800' : 'bg-gray-100 text-gray-500 hover:bg-green-100'
                    }`}
                  >
                    Approved
                  </button>
                </div>
                <button
                  onClick={() => deletePrompt(prompt.id)}
                  className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredPrompts.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <Film className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No prompts found. Add your first prompt to get started!</p>
        </div>
      )}
    </div>
  )
}

import { User, Post, Trip, CompanionIntent, NotificationItem, ReportedItem } from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 'user_elena',
    username: 'elena_climbs',
    fullName: 'Elena Vance',
    email: 'elena.vance@travelin.network',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    coverUrl: '/src/assets/images/traveler_cover_alps_1793636634695.jpg',
    headline: 'High-Altitude Alpine Guide & Documentary Photographer · 42 Summits',
    bio: 'Alpine expedition leader certified with IFMGA. Documenting forgotten ridgelines across the Swiss Alps, Andes, and Karakoram. Passionate about leave-no-trace mountaineering, glaciology research, and connecting with technical expedition partners.',
    location: {
      city: 'Innsbruck',
      country: 'Austria',
    },
    travelInterests: ['Alpine Mountaineering', 'Glacier Hydrology', 'Technical Scrambling', 'Expedition Photography', 'Backcountry Skiing'],
    travelStyles: ['trekking', 'adventure', 'solo'],
    stats: {
      countriesVisited: 38,
      citiesVisited: 94,
      mountainsCompleted: 42,
      tripsCount: 16,
      connectionsCount: 384,
      followersCount: 1820,
    },
    visitedCountries: ['Austria', 'Switzerland', 'France', 'Italy', 'Chile', 'Argentina', 'Nepal', 'Pakistan', 'Norway', 'Iceland', 'Canada', 'Peru'],
    visitedDestinations: [
      { id: 'vd1', name: 'Zermatt & Matterhorn Hornli Ridge', country: 'Switzerland', year: 2024, type: 'mountain', notes: 'Completed west face descent in pristine bluebird conditions.' },
      { id: 'vd2', name: 'El Chaltén & Laguna de los Tres', country: 'Argentina', year: 2025, type: 'mountain', notes: 'Glacial lake survey and bivouac under Fitz Roy.' },
      { id: 'vd3', name: 'Chamonix-Mont-Blanc', country: 'France', year: 2023, type: 'mountain', notes: 'Granite traverse and crevasse rescue coaching.' },
      { id: 'vd4', name: 'Lofoten Islands', country: 'Norway', year: 2024, type: 'coastal', notes: 'Midnight sun ridge ascents and sea-to-summit routes.' }
    ],
    mountainsTreks: [
      { id: 'mt1', name: 'Matterhorn (Hörnli Ridge)', elevationMeters: 4478, region: 'Pennine Alps', country: 'Switzerland', completedYear: 2024, difficulty: 'Extreme' },
      { id: 'mt2', name: 'Mont Blanc via Goûter Route', elevationMeters: 4809, region: 'Haute-Savoie', country: 'France', completedYear: 2023, difficulty: 'Alpine Expedition' },
      { id: 'mt3', name: 'Fitz Roy Base & Paso del Viento', elevationMeters: 3405, region: 'Patagonia', country: 'Argentina', completedYear: 2025, difficulty: 'Challenging' },
      { id: 'mt4', name: 'Annapurna Circuit & Thorong La', elevationMeters: 5416, region: 'Gandaki', country: 'Nepal', completedYear: 2022, difficulty: 'Challenging' }
    ],
    upcomingPlans: [
      { id: 'up1', title: 'Tre Cime & Alta Via 1 Traverse', destination: 'Dolomites', country: 'Italy', dateRange: 'Jun 12 - Jun 22, 2026', status: 'confirmed' },
      { id: 'up2', title: 'Southern Patagonia Ice Field Expedition', destination: 'El Chaltén', country: 'Chile/Argentina', dateRange: 'Nov 04 - Nov 18, 2026', status: 'open_for_companions' }
    ],
    badges: [
      { id: 'b1', name: 'Summit Vanguard', description: 'Documented 40+ recognized 3,000m+ summits with GPS logs', iconName: 'Mountain', category: 'Elevation', issuedAt: '2024' },
      { id: 'b2', name: 'High-Altitude IFMGA', description: 'Certified alpine mountain guide with medical wilderness triage', iconName: 'Award', category: 'Community', issuedAt: '2023' },
      { id: 'b3', name: 'Leave No Trace Master', description: 'Trained environmental steward with clean campsite certification', iconName: 'Shield', category: 'Stewardship', issuedAt: '2025' }
    ],
    isVerified: true,
    role: 'admin',
    joinedAt: '2024-03-15',
  },
  {
    id: 'user_alex',
    username: 'chen_nomad',
    fullName: 'Alex Chen',
    email: 'alex.chen@wayfarer.network',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    coverUrl: '/src/assets/images/traveler_cover_kyoto_1793636635826.jpg',
    headline: 'Overland Explorer & Cultural Geographer · 64 Countries Solo',
    bio: 'Transcontinental overland specialist. Traveled overland from Istanbul to Singapore and crossed the Silk Road through Central Asia. Documenting indigenous architectures, train routes, and night markets.',
    location: {
      city: 'Vancouver',
      country: 'Canada',
    },
    travelInterests: ['Overland Rail', 'Cultural Heritage', 'Street Food Mapping', 'Ancient Architecture', 'Language Exchange'],
    travelStyles: ['solo', 'backpacking', 'cultural', 'road trips'],
    stats: {
      countriesVisited: 64,
      citiesVisited: 182,
      mountainsCompleted: 14,
      tripsCount: 28,
      connectionsCount: 520,
      followersCount: 3410,
    },
    visitedCountries: ['Canada', 'Japan', 'Uzbekistan', 'Georgia', 'Turkey', 'Vietnam', 'Morocco', 'Portugal', 'Mongolia', 'Oman'],
    visitedDestinations: [
      { id: 'vd_a1', name: 'Samarkand & Bukhara', country: 'Uzbekistan', year: 2024, type: 'city', notes: 'Registan tile restoration and desert caravan tracks.' },
      { id: 'vd_a2', name: 'Kyoto Ancient Forest Paths', country: 'Japan', year: 2025, type: 'park', notes: 'Dawn surveys of hidden moss sanctuaries.' },
      { id: 'vd_a3', name: 'Svaneti Towers & Mestia', country: 'Georgia', year: 2023, type: 'mountain', notes: 'Defensive medieval stone towers in high Caucasus.' }
    ],
    mountainsTreks: [
      { id: 'mt_a1', name: 'Mount Fuji via Subashiri Trail', elevationMeters: 3776, region: 'Shizuoka', country: 'Japan', completedYear: 2024, difficulty: 'Moderate' },
      { id: 'mt_a2', name: 'Mount Kazbek High Hut', elevationMeters: 3650, region: 'Stepantsminda', country: 'Georgia', completedYear: 2023, difficulty: 'Challenging' }
    ],
    upcomingPlans: [
      { id: 'up_a1', title: 'Hokkaido Deep Winter Train & Onsen Tour', destination: 'Hokkaido', country: 'Japan', dateRange: 'Jan 15 - Feb 02, 2027', status: 'open_for_companions' }
    ],
    badges: [
      { id: 'b_a1', name: 'Silk Route Pioneer', description: 'Overland passage completed from Bosporus to Central Asia', iconName: 'Compass', category: 'Exploration', issuedAt: '2024' },
      { id: 'b_a2', name: '50+ Sovereign Nations', description: 'Extensive documented residency and travel across 5 continents', iconName: 'Globe', category: 'Exploration', issuedAt: '2023' }
    ],
    isVerified: true,
    role: 'member',
    joinedAt: '2024-04-10',
  },
  {
    id: 'user_priya',
    username: 'priya_wander',
    fullName: 'Priya Sharma',
    email: 'priya.sharma@wayfarer.network',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    coverUrl: '/src/assets/images/hero_patagonia_peaks_1793636634337.jpg',
    headline: 'Expedition Leader & Trail Conservationist · Karakoram & Himalayas',
    bio: 'Leading high-altitude treks across the western Himalayas and Ladakh. Focused on indigenous trail preservation, eco-trekking logistics, and solo female traveler empowerment.',
    location: {
      city: 'New Delhi',
      country: 'India',
    },
    travelInterests: ['Himalayan Passes', 'Trail Mapping', 'Wilderness First Aid', 'Eco-tourism', 'Documentary Writing'],
    travelStyles: ['trekking', 'adventure', 'solo', 'backpacking'],
    stats: {
      countriesVisited: 26,
      citiesVisited: 68,
      mountainsCompleted: 31,
      tripsCount: 19,
      connectionsCount: 410,
      followersCount: 2280,
    },
    visitedCountries: ['India', 'Nepal', 'Bhutan', 'Kyrgyzstan', 'Tanzania', 'Tajikistan', 'Chile'],
    visitedDestinations: [
      { id: 'vd_p1', name: 'Markha Valley, Ladakh', country: 'India', year: 2024, type: 'mountain', notes: 'High desert pass at Kongmaru La (5,260m).' },
      { id: 'vd_p2', name: 'Kilimanjaro via Lemosho', country: 'Tanzania', year: 2023, type: 'mountain', notes: 'Successful summit with zero plastic initiative.' }
    ],
    mountainsTreks: [
      { id: 'mt_p1', name: 'Kilimanjaro (Uhuru Peak)', elevationMeters: 5895, region: 'Kilimanjaro', country: 'Tanzania', completedYear: 2023, difficulty: 'Challenging' },
      { id: 'mt_p2', name: 'Stok Kangri Base & Pass', elevationMeters: 5100, region: 'Ladakh', country: 'India', completedYear: 2024, difficulty: 'Extreme' }
    ],
    upcomingPlans: [
      { id: 'up_p1', title: 'Pamir Highway Overland & High Passes', destination: 'Gorno-Badakhshan', country: 'Tajikistan', dateRange: 'Aug 05 - Aug 20, 2026', status: 'confirmed' }
    ],
    badges: [
      { id: 'b_p1', name: 'Roof of the World', description: 'Crossed 5+ passes above 5,000 meters elevation', iconName: 'Mountain', category: 'Elevation', issuedAt: '2024' }
    ],
    isVerified: true,
    role: 'member',
    joinedAt: '2024-05-18',
  },
  {
    id: 'user_marcus',
    username: 'marcus_arctic',
    fullName: 'Marcus Lindqvist',
    email: 'marcus.arctic@wayfarer.network',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    coverUrl: '/src/assets/images/expedition_dolomites_1793636634749.jpg',
    headline: 'Sub-Arctic Sea Kayaker & Northern Wilderness Guide',
    bio: 'Based in Tromsø above the Arctic circle. Guiding multi-day sea kayaking expeditions through Norwegian fjords and remote Spitsbergen archipelago. Focused on cold-water safety and aurora astronomy.',
    location: {
      city: 'Tromsø',
      country: 'Norway',
    },
    travelInterests: ['Sea Kayaking', 'Arctic Bushcraft', 'Northern Lights', 'Glacier Fjords', 'Wildlife Observation'],
    travelStyles: ['adventure', 'solo', 'road trips'],
    stats: {
      countriesVisited: 22,
      citiesVisited: 45,
      mountainsCompleted: 18,
      tripsCount: 14,
      connectionsCount: 290,
      followersCount: 1450,
    },
    visitedCountries: ['Norway', 'Sweden', 'Finland', 'Iceland', 'Greenland', 'Canada', 'Scotland'],
    visitedDestinations: [
      { id: 'vd_m1', name: 'Svalbard Longyearbyen', country: 'Norway', year: 2024, type: 'coastal', notes: 'Polar bear safety certified sea ice transit.' }
    ],
    mountainsTreks: [
      { id: 'mt_m1', name: 'Galdhøpiggen', elevationMeters: 2469, region: 'Jotunheimen', country: 'Norway', completedYear: 2023, difficulty: 'Moderate' }
    ],
    upcomingPlans: [
      { id: 'up_m1', title: 'Western Fjords Kayak Traverse', destination: 'Geirangerfjord', country: 'Norway', dateRange: 'Jul 10 - Jul 18, 2026', status: 'open_for_companions' }
    ],
    badges: [
      { id: 'b_m1', name: 'Arctic Circle Navigator', description: 'Over 200 days logged north of 66°33′ N latitude', iconName: 'Compass', category: 'Exploration', issuedAt: '2024' }
    ],
    isVerified: true,
    role: 'member',
    joinedAt: '2024-06-01',
  }
];

export const INITIAL_POSTS: Post[] = [
  {
    id: 'post_1',
    authorId: 'user_elena',
    author: {
      id: 'user_elena',
      fullName: 'Elena Vance',
      username: 'elena_climbs',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      headline: 'High-Altitude Alpine Guide & Documentary Photographer · 42 Summits',
      isVerified: true,
    },
    type: 'expedition',
    title: 'Laguna de los Tres & Fitz Roy: Navigating the Patagonian Wind Corridor',
    content: 'At 05:40 AM after four days waiting out 90 km/h squalls in Campamento Poincenot, the barometer finally stabilized. The final 400m scree ascent to Laguna de los Tres is notorious for sudden gusts, but the glacier basin rewarded us with complete mirror calm. \n\nKey technical note for anyone planning this summit traverse in late spring: crampons are strictly necessary above the moraine crest due to early-morning glaze ice. If you are bivouacking, tie off tent guylines to granite deadmen rather than relying on soil stakes.',
    mediaUrls: [
      '/src/assets/images/hero_patagonia_peaks_1793636634337.jpg',
      '/src/assets/images/traveler_cover_alps_1793636634695.jpg'
    ],
    location: {
      name: 'Laguna de los Tres, El Chaltén',
      country: 'Argentina',
    },
    tags: ['Patagonia', 'FitzRoy', 'AlpineClimbing', 'GlacierSafety', 'ExpeditionLog'],
    specs: {
      elevation: '3,405 m',
      distance: '21.4 km round-trip',
      duration: '9h 15m',
      season: 'Late Spring (Nov - Dec)',
      difficulty: 'Challenging Alpine Scramble'
    },
    likesCount: 142,
    commentsCount: 18,
    sharesCount: 34,
    isLiked: false,
    isSaved: false,
    createdAt: '2 hours ago',
    comments: [
      {
        id: 'c1',
        postId: 'post_1',
        authorId: 'user_alex',
        author: {
          id: 'user_alex',
          fullName: 'Alex Chen',
          username: 'chen_nomad',
          avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
          isVerified: true,
        },
        content: 'Incredible clarity on that reflection! Did you carry water from Poincenot or filter directly from the glacial stream before the moraine?',
        createdAt: '1 hour ago',
      },
      {
        id: 'c2',
        postId: 'post_1',
        authorId: 'user_priya',
        author: {
          id: 'user_priya',
          fullName: 'Priya Sharma',
          username: 'priya_wander',
          avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
          isVerified: true,
        },
        content: 'Spot on about the granite deadmen. We saw two dome tents roll into the valley last season when soil pegs gave way in the gale.',
        createdAt: '45 mins ago',
      }
    ],
  },
  {
    id: 'post_2',
    authorId: 'user_alex',
    author: {
      id: 'user_alex',
      fullName: 'Alex Chen',
      username: 'chen_nomad',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      headline: 'Overland Explorer & Cultural Geographer · 64 Countries Solo',
      isVerified: true,
    },
    type: 'guide',
    title: 'The Silent Cedars of Kitayama: A Solo Traveler’s Protocol for Rural Kyoto',
    content: 'Most visitors remain clustered in Gion and Arashiyama. But taking the local Keihan line 45 minutes north opens into Kitayama’s centuries-old cedar groves and secluded moss sanctuaries. \n\nTips for travelers respecting local forestry customs: \n1. Do not step off marked cobblestone flagstones; moss regeneration here takes up to 7 years.\n2. Carry all personal waste back into the train terminal bins.\n3. Mornings before 08:30 offer profound atmospheric stillness with zero tourist buses.',
    mediaUrls: [
      '/src/assets/images/traveler_cover_kyoto_1793636635826.jpg'
    ],
    location: {
      name: 'Kitayama Cedar Valley, Kyoto',
      country: 'Japan',
    },
    tags: ['Kyoto', 'SoloTravel', 'CulturalHeritage', 'JapanOffTheBeatenPath', 'SlowTravel'],
    specs: {
      distance: '14.2 km loop',
      duration: '4h 30m',
      season: 'Autumn / Early Spring',
      difficulty: 'Gentle Pilgrimage Trail'
    },
    likesCount: 98,
    commentsCount: 12,
    sharesCount: 21,
    isLiked: false,
    isSaved: true,
    createdAt: '6 hours ago',
    comments: [
      {
        id: 'c3',
        postId: 'post_2',
        authorId: 'user_marcus',
        author: {
          id: 'user_marcus',
          fullName: 'Marcus Lindqvist',
          username: 'marcus_arctic',
          avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
          isVerified: true,
        },
        content: 'The lighting in this grove is therapeutic. Adding this route to my train connection notes for next spring.',
        createdAt: '3 hours ago',
      }
    ],
  },
  {
    id: 'post_3',
    authorId: 'user_marcus',
    author: {
      id: 'user_marcus',
      fullName: 'Marcus Lindqvist',
      username: 'marcus_arctic',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
      headline: 'Sub-Arctic Sea Kayaker & Northern Wilderness Guide',
      isVerified: true,
    },
    type: 'expedition',
    title: 'Tre Cime di Lavaredo High Loop: Dolomites Late-Season Expedition',
    content: 'Traversing the north faces of the three vertical monoliths as the autumn sun drops into Cortina d’Ampezzo. What makes the Dolomites remarkable is the contrast between sheer vertical dolomite limestone walls and the rolling alpine wildflower pastures below.\n\nGear advisory: Refugio Locatelli closes mid-October, so self-sufficient bivouac and alpine stove systems are required for late-season high ridgelines.',
    mediaUrls: [
      '/src/assets/images/expedition_dolomites_1793636634749.jpg'
    ],
    location: {
      name: 'Tre Cime di Lavaredo, South Tyrol',
      country: 'Italy',
    },
    tags: ['Dolomites', 'TreCime', 'HighAlps', 'TrekkingEurope', 'Bivouac'],
    specs: {
      elevation: '2,999 m peak / 2,450 m loop',
      distance: '10.5 km loop',
      duration: '4h 45m',
      season: 'July to October',
      difficulty: 'Moderate Alpine'
    },
    likesCount: 167,
    commentsCount: 14,
    sharesCount: 42,
    isLiked: true,
    isSaved: false,
    createdAt: '1 day ago',
    comments: [],
  }
];

export const INITIAL_TRIPS: Trip[] = [
  {
    id: 'trip_1',
    creatorId: 'user_elena',
    creator: {
      id: 'user_elena',
      fullName: 'Elena Vance',
      username: 'elena_climbs',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      headline: 'High-Altitude Alpine Guide & Documentary Photographer · 42 Summits',
      isVerified: true,
    },
    title: 'Alta Via 1 High Alpine Traverse & Tre Cime Crossing',
    destination: 'Cortina d’Ampezzo & South Tyrol',
    country: 'Italy',
    coverUrl: '/src/assets/images/expedition_dolomites_1793636634749.jpg',
    startDate: '2026-06-15',
    endDate: '2026-06-25',
    budgetTier: '$$',
    estimatedBudget: '€1,450 / person (Refugio stays + meals)',
    travelStyle: 'trekking',
    difficulty: 'Challenging',
    maxSpots: 6,
    participants: [
      {
        id: 'user_elena',
        fullName: 'Elena Vance',
        username: 'elena_climbs',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        isVerified: true,
        role: 'organizer',
      },
      {
        id: 'user_alex',
        fullName: 'Alex Chen',
        username: 'chen_nomad',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
        isVerified: true,
        role: 'confirmed',
      }
    ],
    pendingRequests: [
      {
        userId: 'user_priya',
        user: {
          id: 'user_priya',
          fullName: 'Priya Sharma',
          username: 'priya_wander',
          avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
          headline: 'Expedition Leader & Trail Conservationist',
        },
        requestedAt: '2 days ago',
        message: 'Experienced with high altitude pass crossings and would love to document the southern descent section.',
      }
    ],
    description: 'An iconic 120km point-to-point trek across the heart of the Italian Dolomites from Lago di Braies down toward Belluno. We will be traversing high karst plateaus, dramatic vertical limestone pinnacles, and historic WWI via ferrata galleries. Sleeping in vetted mountain rifugios with hot local Tyrolean dinners.',
    itinerary: [
      { day: 1, title: 'Lago di Braies to Rifugio Biella', description: 'Begin under the massive north face of Croda del Becco, ascending through karst scree to 2,327m.' },
      { day: 2, title: 'Plateau of Fanes & Rifugio Lavarella', description: 'Scenic rolling green pastures bordered by towering rock amphitheaters.' },
      { day: 3, title: 'Lagazuoi Tunnels & Falzarego Pass', description: 'Historical exploration of carved military tunnels followed by breathtaking 360-degree sunset vista.' },
      { day: 4, title: 'Nuvolau Ridge & Cinque Torri', description: 'Dramatic ridge walking between jagged towers and rock-climbing sectors.' },
      { day: 5, title: 'Pelmo & Civetta Massifs to Belluno', description: 'Final traverse under the 1,000m sheer vertical northwest wall of Monte Civetta.' }
    ],
    gearRequirements: [
      '35-45L Technical Backpack',
      'Sturdy Vibram-soled mountaineering boots',
      'Via Ferrata Kit & Climbing Helmet (UIAA certified)',
      '3-layer Gore-Tex hardshell & thermal layers',
      'Trekking poles with rubber tips for rock'
    ],
    status: 'open',
    createdAt: '2026-05-01',
  },
  {
    id: 'trip_2',
    creatorId: 'user_priya',
    creator: {
      id: 'user_priya',
      fullName: 'Priya Sharma',
      username: 'priya_wander',
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
      headline: 'Expedition Leader & Trail Conservationist',
      isVerified: true,
    },
    title: 'Markha Valley High Desert & Kongmaru La Crossing',
    destination: 'Ladakh & Hemis National Park',
    country: 'India',
    coverUrl: '/src/assets/images/hero_patagonia_peaks_1793636634337.jpg',
    startDate: '2026-08-10',
    endDate: '2026-08-20',
    budgetTier: '$',
    estimatedBudget: '$850 / person (Includes homestays, pack ponies, park permits)',
    travelStyle: 'adventure',
    difficulty: 'Expedition Grade',
    maxSpots: 8,
    participants: [
      {
        id: 'user_priya',
        fullName: 'Priya Sharma',
        username: 'priya_wander',
        avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
        isVerified: true,
        role: 'organizer',
      }
    ],
    pendingRequests: [],
    description: 'A trans-Himalayan high desert expedition traversing deep canyons, river crossings, and isolated Tibetan Buddhist villages inside Hemis National Park. Concludes with a challenging ascent to the prayer-flag strewn summit of Kongmaru La pass at 5,260m with views of Kang Yatse.',
    itinerary: [
      { day: 1, title: 'Leh Acclimatization & Monastery Briefing', description: 'Rest day at 3,500m visiting Thiksey and Hemis monasteries.' },
      { day: 2, title: 'Chilling to Skiu Canyon Trail', description: 'Crossing the turquoise Zanskar river via cable bridge into deep granite gorges.' },
      { day: 3, title: 'Markha Village Settlement', description: 'Traditional clay-brick village homestays and barley terrace irrigation canals.' },
      { day: 4, title: 'Thachungtse to Nimaling Pastures', description: 'Ascent to high alpine summer grazing meadows under Kang Yatse peak.' },
      { day: 5, title: 'Kongmaru La Pass (5,260m) & Shang Sumdo', description: 'Sunrise push over the high pass into vibrant red and purple mineral gorges.' }
    ],
    gearRequirements: [
      'Down Sleeping Bag (-10°C comfort rating)',
      'Water purification pump / UV pen',
      'Neoprene river-crossing booties',
      'UV 400 glacier sunglasses'
    ],
    status: 'open',
    createdAt: '2026-05-10',
  },
  {
    id: 'trip_3',
    creatorId: 'user_marcus',
    creator: {
      id: 'user_marcus',
      fullName: 'Marcus Lindqvist',
      username: 'marcus_arctic',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
      headline: 'Sub-Arctic Sea Kayaker & Northern Wilderness Guide',
      isVerified: true,
    },
    title: 'Lofoten Sea-to-Summit Kayak & Wild Camp Expedition',
    destination: 'Lofoten Archipelago',
    country: 'Norway',
    coverUrl: '/src/assets/images/traveler_cover_alps_1793636634695.jpg',
    startDate: '2026-07-05',
    endDate: '2026-07-14',
    budgetTier: '$$$',
    estimatedBudget: '$2,100 / person (Sea kayak rental, drysuits, safety escort)',
    travelStyle: 'adventure',
    difficulty: 'Moderate',
    maxSpots: 5,
    participants: [
      {
        id: 'user_marcus',
        fullName: 'Marcus Lindqvist',
        username: 'marcus_arctic',
        avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
        isVerified: true,
        role: 'organizer',
      }
    ],
    pendingRequests: [],
    description: 'Paddling between dramatic granite peaks rising directly from crystalline Arctic fjords. We will wild camp on secluded white sand beaches accessible only by water, cook freshly caught cod, and hike ridge lines under 24 hours of midnight sun.',
    itinerary: [
      { day: 1, title: 'Svolvær Base Assembly & Wet Exit Drills', description: 'Fitting drysuits and practicing self-rescues in Reine fjord.' },
      { day: 2, title: 'Reinefjorden to Bunes Beach', description: 'Paddling into steep fjord walls, portaging across pass to remote surf beach.' },
      { day: 3, title: 'Reinebringen Ridge Ascent', description: 'Midnight sun summit scramble over Reine village lagoon.' }
    ],
    gearRequirements: [
      'Cold water drysuit (provided or bring your own)',
      'Waterproof drybags 20L + 10L',
      'Windproof 4-season geodesic tent'
    ],
    status: 'open',
    createdAt: '2026-05-15',
  }
];

export const INITIAL_COMPANIONS: CompanionIntent[] = [
  {
    id: 'ci_1',
    userId: 'user_elena',
    user: INITIAL_USERS[0],
    destination: 'Southern Patagonia Ice Field',
    country: 'Argentina & Chile',
    dateRange: 'Nov 2026 (14 Days)',
    travelStyle: 'trekking',
    budgetTier: '$$',
    groupSizePreference: 'Small team (2 - 4 people)',
    description: 'Looking for 1 or 2 technically proficient mountaineers comfortable on crevassed glacial terrain for a non-guided traverse across Paso del Viento. Must have prior experience with glacier travel and winter bivouacs.',
    interests: ['Glacier Travel', 'Crevasse Rescue', 'Expedition Photography', 'Alpine Bivouac'],
    compatibilityScore: 96,
  },
  {
    id: 'ci_2',
    userId: 'user_alex',
    user: INITIAL_USERS[1],
    destination: 'Kyoto to Hokkaido via Tohoku Overland',
    country: 'Japan',
    dateRange: 'Jan - Feb 2027 (3 Weeks)',
    travelStyle: 'solo',
    budgetTier: '$$',
    groupSizePreference: '1-2 Companions for shared rail passes & ryokans',
    description: 'Planning a slow overland rail journey exploring historic post towns, snow monkey habitats in Nagano, and deep powder hot springs across northern Honshu and Hokkaido. Seeking culturally curious travelers who appreciate food culture.',
    interests: ['Rail Journeys', 'Onsens & Ryokans', 'Photography', 'Local Cuisine'],
    compatibilityScore: 92,
  },
  {
    id: 'ci_3',
    userId: 'user_priya',
    user: INITIAL_USERS[2],
    destination: 'Pamir Highway & Wakhan Corridor',
    country: 'Tajikistan',
    dateRange: 'August 2026 (16 Days)',
    travelStyle: 'adventure',
    budgetTier: '$',
    groupSizePreference: '3 - 4 people to share 4x4 vehicle costs',
    description: 'Organizing a private 4WD overland expedition traversing the high M41 Pamir Highway along the Afghan border. Looking for adventurous road-trippers to split 4x4 hire and homestay logistics.',
    interests: ['High Altitude Passes', 'Homestays', 'Overland 4x4', 'Silk Road'],
    compatibilityScore: 88,
  },
  {
    id: 'ci_4',
    userId: 'user_marcus',
    user: INITIAL_USERS[3],
    destination: 'Svalbard High Arctic Sea Kayaking',
    country: 'Norway',
    dateRange: 'July 2026 (10 Days)',
    travelStyle: 'adventure',
    budgetTier: '$$$',
    groupSizePreference: '2 - 3 experienced paddlers',
    description: 'Seeking 2 sea kayakers with 3-star sea qualification or equivalent cold-water experience to join a self-supported paddle along the glaciers of Isfjorden.',
    interests: ['Wilderness Navigation', 'Cold Water Safety', 'Arctic Wildlife', 'Sea Kayaking'],
    compatibilityScore: 84,
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif_1',
    userId: 'user_elena',
    type: 'connection_request',
    actor: {
      id: 'user_alex',
      fullName: 'Alex Chen',
      username: 'chen_nomad',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    },
    title: 'Connection Request',
    message: 'Alex Chen wants to connect with you on travelIN network.',
    referenceId: 'user_alex',
    read: false,
    createdAt: '10 mins ago',
  },
  {
    id: 'notif_2',
    userId: 'user_elena',
    type: 'trip_join_request',
    actor: {
      id: 'user_priya',
      fullName: 'Priya Sharma',
      username: 'priya_wander',
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    },
    title: 'Trip Join Request',
    message: 'Priya Sharma requested to join your upcoming trip: Alta Via 1 High Alpine Traverse.',
    referenceId: 'trip_1',
    read: false,
    createdAt: '2 hours ago',
  },
  {
    id: 'notif_3',
    userId: 'user_elena',
    type: 'post_like',
    actor: {
      id: 'user_marcus',
      fullName: 'Marcus Lindqvist',
      username: 'marcus_arctic',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    },
    title: 'Post Endorsement',
    message: 'Marcus Lindqvist liked your expedition log on Laguna de los Tres.',
    referenceId: 'post_1',
    read: true,
    createdAt: '1 day ago',
  }
];

export const INITIAL_REPORTS: ReportedItem[] = [
  {
    id: 'rep_1',
    type: 'post',
    targetId: 'post_sample_spam',
    reportedBy: 'user_elena',
    reason: 'Commercial booking solicitation / spam',
    details: 'User posted an unsolicited 3rd party timeshare promo disguised as a trail report.',
    status: 'pending',
    createdAt: 'Yesterday',
    itemPreview: 'Cheap resort stays in Cancun! Click external booking link for discount codes!',
  }
];

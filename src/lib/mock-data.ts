
import type { User, DataBundle, Order, AgentCommissionSettings, CashoutRequest, GlobalMessage, Gig, GigOrder } from './types';

export let mockUsers: User[] = [
  {
    id: 'agent1',
    name: 'John Doe',
    email: 'agent@example.com',
    password: 'password123',
    phoneNumber: '0240000000',
    role: 'agent',
    status: 'active',
    subscriptionStatus: 'active',
    subscriptionExpiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    isApproved: true,
    commissionBalance: 50.75,
    lastDismissedGlobalMessageId: 'globalMsg1',
  },
  {
    id: 'agent2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'password123',
    phoneNumber: '0200000000',
    role: 'agent',
    status: 'pending',
    subscriptionStatus: 'pending_payment',
    subscriptionExpiryDate: null,
    isApproved: false,
    commissionBalance: 15.20,
  },
  {
    id: 'admin1',
    name: 'Platform Administrator',
    email: 'sales.dataflex@gmail.com',
    password: 'adamantis38_',
    role: 'admin',
  },
];

const mtnBundlesRaw = {
    "1GB": "6.00",
    "2GB": "12.00",
    "3GB": "16.00",
    "4GB": "21.00",
    "5GB": "27.00",
    "6GB": "31.00",
    "7GB": "36.00",
    "8GB": "40.00",
    "10GB": "46.00",
    "15GB": "67.00",
    "20GB": "84.00",
    "25GB": "105.00",
    "30GB": "126.00",
    "40GB": "163.00",
    "50GB": "201.00",
    "100GB": "396.00"
};

const airteltigoBundlesRaw = {
    "1GB": "6.00",
    "2GB": "10.00",
    "3GB": "16.00",
    "4GB": "21.00",
    "5GB": "25.00",
    "6GB": "27.00",
    "7GB": "31.00",
    "8GB": "36.00",
    "9GB": "40.00",
    "10GB": "44.00",
    "15GB": "57.00",
    "20GB": "66.00",
    "25GB": "81.00",
    "30GB": "91.00",
    "40GB": "106.00",
    "50GB": "116.00",
    "60GB": "126.00",
    "80GB": "156.00",
    "100GB": "217.00"
};

const telecelBundlesRaw = {
    "5GB": "28.00",
    "10GB": "47.00",
    "15GB": "68.00",
    "20GB": "89.00",
    "25GB": "109.00",
    "30GB": "127.00",
    "40GB": "169.00",
    "50GB": "207.00",
    "100GB": "414.00"
};

const generateBundles = (networkName: string, rawBundles: Record<string, string>): DataBundle[] => {
    return Object.entries(rawBundles).map(([amount, priceStr], index) => {
        const price = parseFloat(priceStr.replace("₵", ""));
        return {
            id: `${networkName.toLowerCase().replace(/\s+/g, '-')}-${amount.toLowerCase()}-${index}`,
            name: `${networkName} ${amount}`,
            dataAmount: amount,
            price: price,
            validityPeriodDays: 90, // 3 Months
            isActive: true,
            description: `Authentic ${networkName} data bundle. Valid for 90 days.`
        };
    });
};

export let mockDataBundles: DataBundle[] = [
    ...generateBundles("MTN", mtnBundlesRaw),
    ...generateBundles("AirtelTigo", airteltigoBundlesRaw),
    ...generateBundles("Telecel", telecelBundlesRaw),
];


export let mockOrders: Order[] = [
  {
    id: 'order1',
    agentId: 'agent1',
    agentName: 'John Doe',
    bundleId: 'mtn-5gb-4', // Example, ensure this ID matches one from generated bundles
    bundleName: 'MTN 5GB',
    orderDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'completed',
    pricePaid: 27.00, // Match the price from mtnBundlesRaw for 5GB
    paymentReference: 'MM12345',
  },
  {
    id: 'order2',
    agentId: 'agent1',
    agentName: 'John Doe',
    bundleId: 'airteltigo-10gb-9', // Example
    bundleName: 'AirtelTigo 10GB',
    orderDate: new Date().toISOString(),
    status: 'processing',
    pricePaid: 44.00, // Match price from airteltigoBundlesRaw
    paymentReference: 'MM67890',
  },
];

export let mockAgentCommissionSettings: AgentCommissionSettings = {
  commissionRate: 0.05, // 5% global commission rate for data bundles
};

export let mockCashoutRequests: CashoutRequest[] = [
  {
    id: 'cashout1',
    agentId: 'agent1',
    agentName: 'John Doe',
    amount: 25,
    requestedDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    status: 'pending',
  },
  {
    id: 'cashout2',
    agentId: 'agent2',
    agentName: 'Jane Smith',
    amount: 10,
    requestedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'paid',
    processedDate: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString(),
    transactionReference: 'MMPAY123',
  },
];

export let mockGlobalMessages: GlobalMessage[] = [
  { id: 'globalMsg1', message: 'Welcome to the new agent dashboard! Explore the features.', createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), isActive: false },
  { id: 'globalMsg2', message: 'Exciting new "Gigs" section is now live! Offer more services and earn more. Check it out!', createdAt: new Date().toISOString(), isActive: true },
];

export let mockGigs: Gig[] = [
  { 
    id: 'gig1', 
    name: 'Basic Logo Design', 
    description: 'Get a professional logo for your business. 2 concepts, 3 revisions.', 
    price: 150, 
    commission: 15, 
    isActive: true, 
    category: 'Design', 
    imageUrl: '/images/placeholder-gig-logo.png',
    termsAndConditions: '1. Two initial logo concepts provided. 2. Up to three rounds of revisions on the chosen concept. 3. Final files delivered in PNG, JPG, and SVG formats. 4. Payment is non-refundable once work has commenced. 5. Standard turnaround time is 3-5 business days.'
  },
  { 
    id: 'gig2', 
    name: 'Social Media Post Design (5 Posts)', 
    description: 'Eye-catching designs for your social media channels.', 
    price: 200, 
    commission: 20, 
    isActive: true, 
    category: 'Social Media', 
    imageUrl: '/images/placeholder-gig-social.png',
    termsAndConditions: '1. Includes 5 unique post designs for one platform. 2. Client to provide all text content and any specific images/logos. 3. Two rounds of revisions per post. 4. Delivery within 3-4 business days.'
  },
  { 
    id: 'gig3', 
    name: 'CV/Resume Writing', 
    description: 'Professionally written CV to help you land your dream job.', 
    price: 100, 
    commission: 10, 
    isActive: true, 
    category: 'Writing', 
    imageUrl: '/images/placeholder-gig-cv.png',
    termsAndConditions: '1. Requires existing CV or detailed work/education history. 2. One professionally written CV in Word and PDF. 3. Up to two rounds of revisions. 4. Turnaround 2-3 business days.'
  },
  { 
    id: 'gig4', 
    name: 'Simple WordPress Website Setup', 
    description: 'Get a basic WordPress website (up to 3 pages) setup.', 
    price: 500, 
    commission: 50, 
    isActive: true, 
    category: 'Web Development',
    imageUrl: '/images/placeholder-gig-website.png',
    termsAndConditions: '1. Includes WordPress installation, theme setup (free or client-provided premium theme), and up to 3 basic pages (e.g., Home, About, Contact). 2. Client provides all content (text, images). 3. Does not include custom coding or advanced features. 4. Domain and hosting not included. 5. Turnaround time 7-10 business days.'
  },
  { 
    id: 'gig5', 
    name: 'Product Description Writing (5 products)', 
    description: 'Compelling product descriptions to boost sales.', 
    price: 120, 
    commission: 12, 
    isActive: false, 
    category: 'Writing',
    imageUrl: '/images/placeholder-gig-writing.png',
  },
  { 
    id: 'gig6', 
    name: 'Video Editing (Short Promo)', 
    description: 'Basic video editing for a short promotional video (up to 1 min).', 
    price: 250, 
    commission: 25, 
    isActive: true, 
    category: 'Video',
    imageUrl: '/images/placeholder-gig-video.png',
    termsAndConditions: '1. Client provides all raw footage and audio. 2. Includes basic cuts, transitions, and text overlays. 3. Up to 1 minute final video length. 4. One round of revisions. 5. Music not included unless royalty-free provided by client.'
  },
  { id: 'gig7', name: 'Flyer Design', description: 'Professional flyer design for your event or business.', price: 80, commission: 8, isActive: true, category: 'Design', imageUrl: '/images/placeholder-gig-flyer.png', termsAndConditions: 'Single-sided flyer design. Up to 2 revisions. Print-ready PDF provided.'},
  { id: 'gig8', name: 'Blog Post Writing (500 words)', description: 'SEO-friendly blog post on a topic of your choice.', price: 100, commission: 10, isActive: true, category: 'Writing', imageUrl: '/images/placeholder-gig-blog.png', termsAndConditions: 'Up to 500 words. Client provides topic and keywords. 1 revision.'},
  { id: 'gig9', name: 'Business Card Design', description: 'Creative business card design.', price: 70, commission: 7, isActive: true, category: 'Design', imageUrl: '/images/placeholder-gig-bizcard.png', termsAndConditions: 'Double-sided business card. 2 concepts. 2 revisions. Print-ready files.'},
  { id: 'gig10', name: 'Data Entry (100 records)', description: 'Accurate data entry services.', price: 50, commission: 5, isActive: true, category: 'Admin Support', imageUrl: '/images/placeholder-gig-dataentry.png', termsAndConditions: 'Up to 100 records/rows. Client provides data source and template. Accuracy guaranteed.'},
  { id: 'gig11', name: 'Proofreading & Editing (1000 words)', description: 'Grammar, spelling, and punctuation check.', price: 60, commission: 6, isActive: true, category: 'Writing', imageUrl: '/images/placeholder-gig-proofread.png', termsAndConditions: 'For documents up to 1000 words. Focus on grammar, spelling, punctuation. Not content rewriting.'},
  { id: 'gig12', name: 'PowerPoint Presentation Design (10 slides)', description: 'Professional presentation design.', price: 150, commission: 15, isActive: true, category: 'Design', imageUrl: '/images/placeholder-gig-ppt.png', termsAndConditions: 'Up to 10 slides. Client provides content. Custom design based on brand/requirements. 2 revisions.'},
  { id: 'gig13', name: 'Email Signature Design', description: 'Professional HTML email signature.', price: 40, commission: 4, isActive: true, category: 'Design', imageUrl: '/images/placeholder-gig-emailsig.png', termsAndConditions: 'Clickable HTML email signature. 1 design concept. 2 revisions.'},
  { id: 'gig14', name: 'IT Support Consultation (30 mins)', description: 'Basic IT support consultation via call.', price: 75, commission: 7.50, isActive: true, category: 'IT Support', imageUrl: '/images/placeholder-gig-itsupport.png', termsAndConditions: 'Remote consultation via phone/video call. For basic troubleshooting and advice. Max 30 minutes.'},
  { id: 'gig15', name: 'Facebook Ad Campaign Setup (Basic)', description: 'Setup a basic Facebook ad campaign.', price: 180, commission: 18, isActive: true, category: 'Marketing', imageUrl: '/images/placeholder-gig-fbads.png', termsAndConditions: 'Includes setup of 1 ad set and 1 ad. Client provides ad creative and copy. Does not include ad spend management.'},
];

export let mockGigOrders: GigOrder[] = [
  {
    id: 'gigOrder1',
    agentId: 'agent1',
    agentName: 'John Doe',
    gigId: 'gig1',
    gigName: 'Basic Logo Design',
    orderDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'completed',
    pricePaid: 150,
    agentCommissionEarned: 15, 
    clientName: 'Client A',
    clientContact: '0551234567',
    requirements: 'Need a modern logo for a tech startup. Colors: blue and silver.',
    adminNotes: 'Logo delivered and approved by client.',
    processedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    paymentReference: 'GIGPAY123',
  },
  {
    id: 'gigOrder2',
    agentId: 'agent1',
    agentName: 'John Doe',
    gigId: 'gig3',
    gigName: 'CV/Resume Writing',
    orderDate: new Date().toISOString(),
    status: 'pending_requirements',
    pricePaid: 100,
    clientName: 'Client B',
    clientContact: 'clientb@email.com',
    agentNotes: 'Client will send old CV by EOD.',
  },
];

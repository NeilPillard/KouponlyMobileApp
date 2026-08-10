import type { Campaign, Category, Challenge, DirectoryItem, Earning, HeroSlide, Offer, Opportunity, Partner, Reward, UserProfile } from '@/types';

const img = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1000&q=88`;

export const profile: UserProfile = { id: 'neil', name: 'Neil Jose Pillard', email: 'neil.j.pillard@gmail.com', phone: '+91 98765 43210', city: 'Kochi', membership: 'Member', creatorAccepted: true };

export const categories: Category[] = [
  ['mains','Mains','Big, satisfying plates made for hungry Kochi days.',img('photo-1589302168068-964664d93dc0'),['food','biryani','burger','pizza'],['All','Biryani','Burgers','Pizza','Shawarma']],
  ['snacks','Snacks','Quick bites and shareable plates between meals.',img('photo-1573080496219-bb080dd4f877'),['snacks','fries','wraps'],['All','Fries','Wraps','Wings']],
  ['drinks','Drinks','Coffee runs and refreshing sips around Kerala.',img('photo-1495474472287-4d71bcdd2085'),['coffee','tea','juice'],['All','Coffee','Tea','Juices']],
  ['sweets','Sweets','Celebration cakes and sweet reasons to meet.',img('photo-1551024506-0bccd828d307'),['cake','dessert','waffle'],['All','Cakes','Ice-Cream','Waffles']],
  ['cuisines','Cuisines','Kerala classics, global favourites and comfort food.',img('photo-1515003197210-e0cd71810b5f'),['indian','arabic','italian'],['All','Indian','Arabic','Italian']],
  ['dietary','Dietary','Feel-good picks that fit the way you eat.',img('photo-1512621776951-a57141f2eefd'),['healthy','vegan','salad'],['All','Healthy','Vegan','Salads']],
  ['breakfast','Breakfast','Start slow or strong with breakfast favourites.',img('photo-1533089860892-a7c6f0a88666'),['breakfast','toast','pancake'],['All','Pancakes','Toast','Omelettes']],
  ['buffet','Buffet','Platters, thalis and generous all-you-can-eat plans.',img('photo-1552566626-52f8b828add9'),['buffet','thali','feast'],['All','Platters','Thalis','Unlimited']],
  ['beauty','Beauty','Salon, self-care and wellness offers without the full-price guilt.',img('photo-1596462502278-27bfdc403348'),['beauty','salon','spa','skincare'],['All','Hair','Nails','Spa','Skincare']],
  ['fitness','Fitness','Gyms, sports and beginner-friendly ways to get moving.',img('photo-1534438327276-14e5300c3a48'),['fitness','gym','sports','workout'],['All','Gyms','Sports','Classes','Free trials']],
  ['things-to-do','Things to do','Easy plans for dates, groups and weekends worth remembering.',img('photo-1593693397690-362cb9666fc2'),['experience','activity','tour','outdoor'],['All','Adventure','Workshops','Tours','Water']],
  ['staycations','Staycations','Short Kerala escapes, pool days and slow weekends nearby.',img('photo-1566073771259-6a8506099945'),['staycation','hotel','resort','stay'],['All','City stays','Beach','Backwaters','Pool day']],
  ['shopping','Shopping','Fashion, tech and useful finds with member-only prices.',img('photo-1441986300917-64674bd600d8'),['shopping','fashion','retail','tech'],['All','Fashion','Tech','Local','Accessories']],
  ['entertainment','Entertainment','Cinema, gaming and fun plans for when the group chat agrees.',img('photo-1489599849927-2ee91cede3ba'),['entertainment','cinema','movie','gaming'],['All','Cinema','Gaming','Events','For groups']],
  ['travel','Travel','Flights, weekend trips and practical ways to see more for less.',img('photo-1507525428034-b723cf961d3e'),['travel','trip','flight','holiday'],['All','Weekend trips','Flights','Road trips','Tours']],
  ['learn','Learn','Short courses and practical skills that move your profile forward.',img('photo-1522202176988-66273c2fd55f'),['learn','course','skills','career'],['All','Free','Career skills','Design','Online']],
  ['internships','Internships','Student-friendly internships, including opportunities with Kouponly.',img('photo-1521737711867-e3b97375f902'),['internship','marketing','sales','trainee'],['All','Marketing','Sales','Design','Remote']],
  ['freelance','Freelance','Local and remote gigs for creators, designers and student talent.',img('photo-1497366754035-f200968a6e72'),['freelance','creator','ugc','gig'],['All','UGC','Design','Video','Photography']],
  ['jobs','Jobs','Flexible part-time and entry-level roles across Kochi and Kerala.',img('photo-1551836022-d5d88e9218df'),['job','part-time','trainee','work'],['All','Part-time','Remote','Retail','Events']],
].map(([slug,name,description,image,keywords,subcategories]) => ({ slug, name, description, image, keywords, subcategories } as Category));

export const offers: Offer[] = [
  { id:'paragon-main', partnerId:'paragon', title:'Buy one biryani, get one free', saving:'Save up to ₹480', value:50, mode:'inStore', renewalDate:'1 September' },
  { id:'starbucks-main', partnerId:'starbucks', title:'Second handcrafted drink free', saving:'Save ₹280', value:50, mode:'inStore', renewalDate:'1 September' },
  { id:'kfc-main', partnerId:'kfc', title:'Two Zinger combos for ₹499', saving:'Save ₹320', value:35, mode:'inStore', renewalDate:'1 September' },
  { id:'marriott-main', partnerId:'marriott', title:'Pool access and lunch for two', saving:'Save ₹1,500', value:40, mode:'online', renewalDate:'1 September', externalUrl:'https://www.marriott.com/' },
  { id:'pvr-main', partnerId:'pvr', title:'Two premium seats from ₹499', saving:'Save ₹350', value:35, mode:'online', renewalDate:'1 September', externalUrl:'https://www.pvrcinemas.com/' },
  { id:'wonderla-main', partnerId:'wonderla', title:'Student day pass at member price', saving:'Save ₹600', value:30, mode:'online', renewalDate:'1 September', externalUrl:'https://www.wonderla.com/' },
];

export const partners: Partner[] = [
  ['paragon','Paragon Restaurant','Lulu Mall, Edappally','Mains',4.8,img('photo-1589302168068-964664d93dc0'),'Legendary Kerala biryani and generous plates for group lunches.',10.0261,76.3083,2.4,['paragon-main'],99,28],
  ['starbucks','Starbucks','Panampilly Nagar','Drinks',4.6,img('photo-1495474472287-4d71bcdd2085'),'Coffee, cold drinks and a bright place to catch up or study.',9.9627,76.2945,1.1,['starbucks-main'],96,25],
  ['kfc','KFC','Centre Square, MG Road','Snacks',4.4,img('photo-1562967914-608f82629710'),'Crunchy favourites and easy-value meals close to campus routes.',9.9816,76.2824,0.8,['kfc-main'],94,24],
  ['marriott','Kochi Marriott','Edappally','Staycations',4.9,img('photo-1566073771259-6a8506099945'),'A polished city escape with pool time and a relaxed lunch.',10.0270,76.3080,4.8,['marriott-main'],92,22],
  ['pvr','PVR Cinemas','Lulu Mall, Edappally','Entertainment',4.5,img('photo-1489599849927-2ee91cede3ba'),'Big-screen plans with premium seats at a smaller member price.',10.0268,76.3086,4.5,['pvr-main'],91,20],
  ['wonderla','Wonderla Kochi','Pallikkara','Things to do',4.7,img('photo-1576610616656-d3aa5d1f4534'),'A full day of rides, water attractions and group-friendly fun.',10.0251,76.3905,15.2,['wonderla-main'],89,18],
].map(([id,name,place,category,rating,image,description,latitude,longitude,distanceKm,offerIds,trend,newest]) => ({ id,name,place,category,rating,image,description,branch:{id:`${id}-kochi`,name:place,latitude,longitude,distanceKm},offerIds,trend,newest } as Partner));

export const heroSlides: HeroSlide[] = [
  ['paragon','Paragon Restaurant','BIRYANI, DOUBLED','Two plates. One happy bill.','Bring your favourite person and save up to ₹480.','See the offer',partners[0].image,'paragon'],
  ['starbucks','Starbucks','COFFEE RUN','Your second cup is on us.','Any two handcrafted drinks, one member price.','Pick a drink',partners[1].image,'starbucks'],
  ['kfc','KFC','CRUNCH TIME','Two combos. Better value.','Share two Zinger combos for ₹499 this week.','Get the deal',partners[2].image,'kfc'],
  ['burger','Burger King','BURGER DATE','Double the Whopper. Less bill.','Buy one Whopper and get one free.','See the menu',img('photo-1568901346375-23c9450c58cd'),'paragon'],
  ['marriott','Kochi Marriott','POOL DAY','A tiny holiday, right here.','Pool access and lunch for two at a member price.','Take a day off',partners[3].image,'marriott'],
  ['nykaa','Nykaa Luxe','BEAUTY DROP','Good skin. Better price.','Fresh beauty offers from brands you love.','Shop the edit',img('photo-1596462502278-27bfdc403348'),undefined,'beauty'],
  ['decathlon','Decathlon','MOVE MORE','Try a new sport for less.','Selected gear and beginner picks for members.','Get moving',img('photo-1517836357463-d25dfeac3438'),undefined,'fitness'],
  ['pvr','PVR Cinemas','MOVIE NIGHT','Big screen. Smaller bill.','Two premium seats from ₹499.','Choose a movie',partners[4].image,'pvr'],
  ['wonderla','Wonderla Kochi','FULL DAY FUN','More rides. Less planning.','Member prices for your next group day out.','Plan the day',partners[5].image,'wonderla'],
  ['indigo','IndiGo','NEXT ESCAPE','Your weekend could be elsewhere.','Short-break fares and extras from Kochi.','Start exploring',img('photo-1436491865332-4c85980aad7e'),undefined,'travel'],
].map(([id,brand,kicker,title,copy,cta,image,partnerId,search]) => ({ id,brand,kicker,title,copy,cta,image,partnerId,search } as HeroSlide));

export const directoryItems: DirectoryItem[] = [
  ...partners.map((p) => ({ id:`partner-${p.id}`,type:'Vendor' as const,title:p.name,subtitle:`${p.place} · ${p.branch.distanceKm} km`,tag:`Up to ${offers.find(o=>o.partnerId===p.id)?.value ?? 25}% off`,image:p.image,description:p.description,action:'View partner',offerValue:offers.find(o=>o.partnerId===p.id)?.value ?? 25,newest:p.newest,trend:p.trend,distanceKm:p.branch.distanceKm,keywords:`${p.name} ${p.place} ${p.category} ${p.description}`.toLowerCase(),partnerId:p.id})),
  { id:'pottery',type:'Experience',title:'Mattancherry pottery workshop',subtitle:'Fort Kochi · 7.2 km',tag:'₹650 member price',image:img('photo-1610701596007-11502861dcfa'),description:'A beginner-friendly clay session in a sunny heritage studio.',action:'View experience',offerValue:25,newest:21,trend:88,distanceKm:7.2,keywords:'experience pottery workshop fort kochi things to do' },
  { id:'design-course',type:'Course',title:'Portfolio design sprint',subtitle:'Online · 2 weeks',tag:'Free for members',image:img('photo-1522202176988-66273c2fd55f'),description:'Build a sharper portfolio with practical feedback and templates.',action:'View course',offerValue:100,newest:27,trend:84,distanceKm:0,keywords:'course learn design portfolio online free' },
  { id:'bd-intern',type:'Internship',title:'BD & Sales internship',subtitle:'Kouponly · Kochi hybrid',tag:'₹12,000/month',image:img('photo-1521737711867-e3b97375f902'),description:'Help Kerala partners launch offers and learn hands-on business development.',action:'Explore role',offerValue:0,newest:29,trend:98,distanceKm:1.5,keywords:'internship bd sales kouponly grow work',destination:'grow' },
  { id:'ugc-creator',type:'Freelance',title:'Become a Kouponly creator',subtitle:'Campaign-based · Paid per brief',tag:'3 campaigns open',image:img('photo-1574717024653-61fd2cf4d44d'),description:'Choose brand campaigns, create short videos and get paid after approval.',action:'View campaigns',offerValue:0,newest:28,trend:99,distanceKm:0,keywords:'creator ugc freelance campaign grow work',destination:'grow' },
  { id:'campus',type:'Internship',title:'Campus Ambassador',subtitle:'Kerala universities · Flexible',tag:'Gold Card benefits',image:img('photo-1541339907198-e08756dedf3f'),description:'Bring Kouponly into campus events and student communities.',action:'Apply to represent campus',offerValue:0,newest:26,trend:95,distanceKm:0,keywords:'campus ambassador student university gold card',destination:'grow' },
  { id:'reward-coffee',type:'Reward',title:'Redeem a free coffee',subtitle:'Participating cafes',tag:'200 points',image:partners[1].image,description:'Exchange points for one regular coffee.',action:'View reward',offerValue:0,newest:20,trend:93,distanceKm:0,keywords:'reward points coffee free',destination:'rewards' },
];

export const opportunities: Opportunity[] = [
  { id:'creator',track:'creator',title:'UGC Creator',subtitle:'Paid per approved brief',description:'Create authentic vertical videos for Kerala brands and local experiences.',benefits:['Choose briefs that fit your style','Clear approval and usage terms','Track every payment'] },
  { id:'bd',track:'bd',title:'BD & Sales Internship',subtitle:'Kochi hybrid · ₹12,000/month',description:'Help onboard partners and shape offers students actually want.',benefits:['Hands-on partner meetings','Weekly mentoring','Completion certificate'] },
  { id:'marketing',track:'marketing',title:'Marketing Internship',subtitle:'Flexible hybrid schedule',description:'Help plan campus launches, social content and community activations.',benefits:['Campaign ownership','Portfolio-ready work','Performance bonus'] },
  { id:'campus',track:'campus',title:'Campus Ambassador',subtitle:'Kerala university students',description:'Represent Kouponly on campus and unlock Gold Card benefits when accepted.',benefits:['Free partner perks','Event support','Leadership experience'] },
];

export const campaigns: Campaign[] = [
  { id:'cafe-reel',title:'A day at French Toast',partner:'French Toast',pay:3500,due:'18 Aug',image:img('photo-1574717024653-61fd2cf4d44d'),status:'available' },
  { id:'wonderla-day',title:'Wonderla group-day reel',partner:'Wonderla Kochi',pay:5000,due:'23 Aug',image:partners[5].image,status:'selected' },
  { id:'marriott-stay',title:'Pool-day story set',partner:'Kochi Marriott',pay:4000,due:'Paid 4 Aug',image:partners[3].image,status:'paid' },
];

export const earnings: Earning[] = [{ id:'earn-1',campaign:'Pool-day story set',amount:4000,status:'paid',date:'4 Aug' },{ id:'earn-2',campaign:'Campus launch reel',amount:8500,status:'paid',date:'24 Jul' }];
export const challenges: Challenge[] = [{id:'save-three',title:'Smart saver',detail:'Redeem three member offers',progress:2,target:3,points:150},{id:'profile',title:'Make it yours',detail:'Complete your profile',progress:4,target:5,points:75},{id:'explorer',title:'Try something new',detail:'Visit a new category',progress:1,target:3,points:100}];
export const rewards: Reward[] = [{id:'coffee',name:'Free regular coffee',detail:'Participating Kochi cafes',points:200,image:partners[1].image},{id:'pottery',name:'Pottery workshop',detail:'Mattancherry studio',points:650,image:directoryItems.find(i=>i.id==='pottery')!.image},{id:'movie',name:'Movie ticket',detail:'Selected weekday shows',points:500,image:partners[4].image}];

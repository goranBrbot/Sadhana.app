import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PropTypes } from "prop-types";

export default function DailyInspiration({ isOpen, onToggle }) {
  const quotes = [
    { quote: "Love God with a pure heart.", author: "Sri Deep Narayan Mahaprabhuji" },
    {
      quote: "If you lead your life according to ethical principles you can fulfil your dharma. Accept the principle of morality and obey it as long as you live.",
      author: "Sri Deep Narayan Mahaprabhuji",
    },
    { quote: "Whatever you plan to do, do it with firm determination and your success will be assured.", author: "Sri Deep Narayan Mahaprabhuji" },
    { quote: "Always hold onto the Truth. Do not think negative and always do good.", author: "Sri Deep Narayan Mahaprabhuji" },
    {
      quote:
        "Do not give up what you have already started. There will always be obstacles in the way, just like roses always have thorns. Remove those obstacles with self-confidence and by God's grace your path will lead you to the goal.",
      author: "Sri Deep Narayan Mahaprabhuji",
    },
    { quote: "Do not be dependent upon others. Stand on your own feet. Trust in your abilities and God will help you.", author: "Sri Deep Narayan Mahaprabhuji" },
    {
      quote: "The success of your actions lies within the strength of your inner conviction and self-discipline. Do not lose your courage and never give up.",
      author: "Sri Deep Narayan Mahaprabhuji",
    },
    { quote: "Outer purity alone is not enough. Pure consciousness needs both inner and outer purity.", author: "Sri Deep Narayan Mahaprabhuji" },
    { quote: "Be truthful. Do not be a hypocrite.", author: "Sri Deep Narayan Mahaprabhuji" },
    { quote: "Be kind to all creatures and helpful at all times. In this way you will also help yourself.", author: "Sri Deep Narayan Mahaprabhuji" },
    { quote: "Beware of arrogance. Respect everyone equally.", author: "Sri Deep Narayan Mahaprabhuji" },
    { quote: "Whatever you think to possess is only transitory. Give up your false pride.", author: "Sri Deep Narayan Mahaprabhuji" },
    { quote: "Do not be proud of your wealth and knowledge. There will always be someone who is better than you.", author: "Sri Deep Narayan Mahaprabhuji" },
    { quote: "Always be honest and nothing will be lost. Dishonesty fails in the end.", author: "Sri Deep Narayan Mahaprabhuji" },
    { quote: "Do not praise yourself. Others may praise you but your greatness lies in modesty.", author: "Sri Deep Narayan Mahaprabhuji" },
    {
      quote:
        "Do not let yourself be discouraged by problems. Earthly life constantly flows between the banks of fortune and grief. One who loses courage won't reach the aim. Fulfil your duties with inner certainty and faith.",
      author: "Sri Deep Narayan Mahaprabhuji",
    },
    {
      quote: "Complete your tasks immediately. Do not postpone them till tomorrow. Realize your good intentions now because one moment is never like the next.",
      author: "Sri Deep Narayan Mahaprabhuji",
    },
    { quote: "Respect everyone equally. Always be ready to help. Without doing good, without right action, life lacks meaning.", author: "Sri Deep Narayan Mahaprabhuji" },
    {
      quote: "All pleasures are transient. Do not succumb to their outer appearance. True joy can be found in the service of all creatures and in this is the wisdom and meaning of life.",
      author: "Sri Deep Narayan Mahaprabhuji",
    },
    {
      quote:
        "Do not waste your time. Each second of your life is precious and irreplaceable. Time passed never comes back, time doesn't wait. If you don't keep up you'll be left behind, so use your time well.",
      author: "Sri Deep Narayan Mahaprabhuji",
    },
    {
      quote: "Everyone has good and bad habits. Do not see the bad in others, rather discover their virtues and emulate them. Learn good from everyone and everything.",
      author: "Sri Deep Narayan Mahaprabhuji",
    },
    {
      quote:
        "Do not allow bad habits to form which will be hard to give up and which may destroy your life. Cultivate good habits which will be helpful all life long. Avoid toxic substances such as tobacco, alcohol and drugs. These only invite illness and death into your house.",
      author: "Sri Deep Narayan Mahaprabhuji",
    },
    { quote: "Rise before sunrise and practise your spiritual exercises. Their benefits will accompany you the whole day.", author: "Sri Deep Narayan Mahaprabhuji" },
    { quote: "Be moderate with eating, as excessive craving for pleasure leads to laziness and disease.", author: "Sri Deep Narayan Mahaprabhuji" },
    { quote: "Respect your parents, your teachers and your Master. Live in love and harmony with your family.", author: "Sri Deep Narayan Mahaprabhuji" },
    { quote: "Always hold onto the Truth. Keep your word even if it costs your life.", author: "Sri Deep Narayan Mahaprabhuji" },
    { quote: "Your words and deeds should equal each other.", author: "Sri Deep Narayan Mahaprabhuji" },
    { quote: "Only pass on what is important. Hollow talk and gossip is lost time.", author: "Sri Deep Narayan Mahaprabhuji" },
    { quote: "Remain true to your partner and avoid situations that may lead you to be unfaithful.", author: "Sri Deep Narayan Mahaprabhuji" },
    {
      quote: "First impressions should never be the basis for your decisions. Wait until you have obtained further knowledge and in this way you will avoid unnecessary disappointments.",
      author: "Sri Deep Narayan Mahaprabhuji",
    },
    { quote: "Debts between friends not settled in time jeopardise the friendship. Give with an open heart, but weigh exactly what to do.", author: "Sri Deep Narayan Mahaprabhuji" },
    {
      quote:
        "Worldly things unnecessarily accumulated only become burdens and will bring sorrow. Material wealth is transient. Lakshmi, the Goddess of wealth, dislikes to be captured. The best possessions to handle are devotion, service and benefaction.",
      author: "Sri Deep Narayan Mahaprabhuji",
    },
    {
      quote: "Avoid words which you may later regret. Do nothing that will give away your principles, cause loss of self respect or sow the seeds of discord.",
      author: "Sri Deep Narayan Mahaprabhuji",
    },
    { quote: "Avoid unnecessary quarrels and avoid bad company. Keep away from hazards. Associate with good and wise people.", author: "Sri Deep Narayan Mahaprabhuji" },
    { quote: "Never speak ill of your parents or your Master. Do not accept malicious talk against them.", author: "Sri Deep Narayan Mahaprabhuji" },
    { quote: "Do not make enemies through thoughtless mistakes. Do not constantly complain about your problems.", author: "Sri Deep Narayan Mahaprabhuji" },
    { quote: "Try your best to promote the realization of ethical ideals. This will contribute to an existence of harmony.", author: "Sri Deep Narayan Mahaprabhuji" },
    { quote: "Learn to control your desires. Do not abandon yourself to dependence on your senses.", author: "Sri Deep Narayan Mahaprabhuji" },
    { quote: "Lethargy is one of your greatest enemies. Without effort you will not reach your aim. So give up your laziness.", author: "Sri Deep Narayan Mahaprabhuji" },
    {
      quote:
        "Do not waste your life in sensual living. Do not permit yourself to be confined to passions. Like the bee, drunk on the pleasant smell of the lotus flower, becomes caught in the closing bloom at sunset, so is a life wasted in transient, sensual pleasures. Do not abandon the quest for spiritual knowledge and development of consciousness.",
      author: "Sri Deep Narayan Mahaprabhuji",
    },
    { quote: "Do not ignore the laws of nature. Never disregard nature or nature will take its retribution.", author: "Sri Deep Narayan Mahaprabhuji" },
    { quote: "When the waves are high one should not dive for pearls.", author: "Sri Deep Narayan Mahaprabhuji" },
    { quote: "View the lives of Saints and important personalities as examples. Whatever someone achieves, is dependent on his or her own effort.", author: "Sri Deep Narayan Mahaprabhuji" },
    {
      quote: "Whoever speaks of the highest knowledge without having actually realized it, still lives in great ignorance. Even if they be very learned, their talk lacks perfection.",
      author: "Sri Deep Narayan Mahaprabhuji",
    },
    {
      quote: "If one wears the robe of an order and turns away from worldly life, yet is still not purified within and adheres not to right action, then their 'renunciation' is meaningless.",
      author: "Sri Deep Narayan Mahaprabhuji",
    },
    { quote: "Avoid places where you are not welcome.", author: "Sri Deep Narayan Mahaprabhuji" },
    { quote: "Wealth must be acquired in an honest way. Use it to achieve good. Earn your money through your own efforts, your own work.", author: "Sri Deep Narayan Mahaprabhuji" },
    { quote: "Do not just take, also learn to give. Constant taking creates a serious burden which is only unloaded by the act of giving.", author: "Sri Deep Narayan Mahaprabhuji" },
    { quote: "Be kind to every creature. Whomsoever hurts others, will themself be hurt.", author: "Sri Deep Narayan Mahaprabhuji" },
    { quote: "Treat others as you wish they should treat you. You will get back everything that you give.", author: "Sri Deep Narayan Mahaprabhuji" },
    { quote: "Love every living being at least as much as yourself.", author: "Sri Deep Narayan Mahaprabhuji" },
    { quote: "God's Light is in every creature. To love and serve them is to love and serve God.", author: "Sri Deep Narayan Mahaprabhuji" },
    {
      quote: "All beings are able to sleep, eat, drink and reproduce. The difference between people and animals is that the purpose of human birth is aimed at Self-knowledge and Self-realization.",
      author: "Sri Deep Narayan Mahaprabhuji",
    },
    { quote: "The perfect awakening of Self-realization takes place through love.", author: "Sri Deep Narayan Mahaprabhuji" },
    {
      quote:
        "Knowledge is limitless. Dive into it! Life is short and time passes quickly, so our experiences are limited. Let the past be gone and be aware that this moment also immediately belongs to the past. Make your future in the present. Therefore, brothers and sisters, wake up! Remember your duty and fulfil your dharma.",
      author: "Sri Deep Narayan Mahaprabhuji",
    },
    {
      quote:
        "Only two kinds of people can attain self-knowledge: those who are not encumbered at all with learning, that is to say, whose minds are not over-crowded with thoughts borrowed from others; and those who, after studying all the scriptures and sciences, have come to realise that they know nothing.",
      author: "Sri Ramakrishna",
    },
    {
      quote:
        "You see many stars in the sky at night, but not when the sun rises. Can you therefore say that there are no stars in the heavens during the day? Because you cannot find God in the days of your ignorance, say not that there is no God.",
      author: "Sri Ramakrishna",
    },
    {
      quote:
        "One man may read the Bhagavata by the light of a lamp, and another may commit a forgery by that very light; but the lamp is unaffected. The sun sheds its light on the wicked as well as on the virtuous.",
      author: "Sri Ramakrishna",
    },
    {
      quote:
        "You speak of doing good to the world. Is the world such a small thing? And who are you, pray, to do good to the world? First realise God, see Him by means of spiritual discipline. If He imparts power you can do good to others; otherwise not.",
      author: "Sri Ramakrishna",
    },
    {
      quote:
        "What Brahman is cannot be described. All things in the world — the Vedas, the Puranas, the Tantras, the six systems of philosophy — have been defiled, like food that has been touched by the tongue, for they have been read or uttered by the tongue. Only one thing has not been defiled in this way, and that is Brahman. No one has ever been able to say what Brahman is.",
      author: "Sri Ramakrishna",
    },
    {
      quote: "As long as I live, so long do I learn.",
      author: "Sri Ramakrishna",
    },
    {
      quote: "God is in all men, but all men are not in God; that is why we suffer.",
      author: "Sri Ramakrishna",
    },
    {
      quote: "The Man who works for others, without any selfish motive, really does good to himself.",
      author: "Sri Ramakrishna",
    },
    {
      quote: "The winds of God's grace are always blowing, it is for us to raise our sails.",
      author: "Sri Ramakrishna",
    },
    {
      quote: "Different creeds are but different paths to reach the same God.",
      author: "Sri Ramakrishna",
    },
    {
      quote: "Common men talk bagfuls of religion but do not practise even a grain of it. The wise man speaks a little, even though his whole life is religion expressed in action.",
      author: "Sri Ramakrishna",
    },
    {
      quote: "Finish the few duties you have at hand, and then you will have peace.",
      author: "Sri Ramakrishna",
    },
    {
      quote: "Do not seek illumination unless you seek it as a man whose hair is on fire seeks a pond.",
      author: "Sri Ramakrishna",
    },
    {
      quote: "If you must be mad, be it not for the things of the world. Be mad with the love of God.",
      author: "Sri Ramakrishna",
    },
    {
      quote: "Bondage and Liberation are of the mind alone.",
      author: "Sri Ramakrishna",
    },
    {
      quote:
        "God has revealed to me that only the Paramatman, whom the Vedas describe as the Pure Soul, is as immutable as Mount Sumeru, unattached, and beyond pain and pleasure. There is much confusion in this world of His maya. One can by no means say that 'this' will come after 'that' or 'this' will produce 'that'.",
      author: "Sri Ramakrishna",
    },
    {
      quote: "God is everywhere but He is most manifest in man. So serve man as God. That is as good as worshipping God.",
      author: "Sri Ramakrishna",
    },
    {
      quote:
        "God has made different religions to suit different aspirants, times, and countries. All doctrines are only so many paths; but a path is by no means God himself. Indeed, one can reach God if one follows any of the paths with whole-hearted devotion...One may eat a cake with icing either straight or sidewise. It will taste sweet either way.",
      author: "Sri Ramakrishna",
    },
    {
      quote: "The goal of life is not the earning of money, but the service of God.",
      author: "Sri Ramakrishna",
    },
    {
      quote: "As Long As I Live, So Long Do I Learn",
      author: "Sri Ramakrishna",
    },
    {
      quote: "Do all your duties, but keep your mind on God.",
      author: "Sri Ramakrishna",
    },
    {
      quote: "Bondage is of the mind; freedom too is of the mind. If you say 'I am a free soul. I am a son of God who can bind me' free you shall be.",
      author: "Sri Ramakrishna",
    },
    {
      quote:
        "God can be realized through all paths. All religions are true. The important thing is to reach the roof. You can reach it by stone stairs or by wooden stairs or by bamboo steps or by a rope. You can also climb up by a bamboo pole.",
      author: "Sri Ramakrishna",
    },
    {
      quote: "When divine vision is attained, all appear equal; and there remains no distinction of good and bad, or of high and low.",
      author: "Sri Ramakrishna",
    },
    {
      quote: "It is easy to talk on religion, but difficult to practice it.",
      author: "Sri Ramakrishna",
    },
    {
      quote:
        "If you desire to be pure, have firm faith, and slowly go on with your devotional practices without wasting your energy in useless scriptural discussions and arguments. Your little brain will otherwise be muddled.",
      author: "Sri Ramakrishna",
    },
    {
      quote: "Through selfless work, love of God grows in heart.",
      author: "Sri Ramakrishna",
    },
    {
      quote: "That knowledge which purifies the mind and heart alone is true Knowledge, all else is only a negation of Knowledge.",
      author: "Sri Ramakrishna",
    },
    {
      quote: "Many good sayings are to be found in holy books, but merely reading them will not make one religious.",
      author: "Sri Ramakrishna",
    },
    {
      quote: "Why should you renounce everything? You are all right as you are, following the middle...",
      author: "Sri Ramakrishna",
    },
    {
      quote:
        "Take up one idea. Make that one idea your life; dream of it; think of it; live on that idea. Let the brain, the body, muscles, nerves, every part of your body be full of that idea, and just leave every other idea alone. This is the way to success, and this is the way great spiritual giants are produced.",
      author: "Swami Vivekananda",
    },
    {
      quote: "You have to grow from the inside out. None can teach you, none can make you spiritual. There is no other teacher but your own soul.",
      author: "Swami Vivekananda",
    },
    {
      quote: "In a conflict between the heart and the brain, follow your heart.",
      author: "Swami Vivekananda",
    },
    {
      quote: "In a day, when you don't come across any problems - you can be sure that you are travelling in a wrong path",
      author: "Swami Vivekananda",
    },
    {
      quote: "The great secret of true success, of true happiness, is this: the man or woman who asks for no return, the perfectly unselfish person, is the most successful.",
      author: "Swami Vivekananda",
    },
    {
      quote:
        "All power is within you; you can do anything and everything. Believe in that, do not believe that you are weak; do not believe that you are half-crazy lunatics, as most of us do nowadays. You can do any thing and everything, without even the guidance of any one. Stand up and express the divinity within you.",
      author: "Swami Vivekananda",
    },
    {
      quote: "The greatest religion is to be true to your own nature. Have faith in yourselves.",
      author: "Swami Vivekananda",
    },
    {
      quote: "The greatest sin is to think yourself weak",
      author: "Swami Vivekananda",
    },
    {
      quote: "Anything that makes weak - physically, intellectually and spiritually, reject it as poison.",
      author: "Swami Vivekananda",
    },
    {
      quote: "Dare to be free, dare to go as far as your thought leads, and dare to carry that out in your life.",
      author: "Swami Vivekananda",
    },
    {
      quote: "We are what our thoughts have made us; so take care about what you think. Words are secondary. Thoughts live; they travel far.",
      author: "Swami Vivekananda",
    },
    {
      quote: "Arise, awake, stop not till the goal is reached.",
      author: "Swami Vivekananda",
    },
    {
      quote: "They alone live, who live for others.",
      author: "Swami Vivekananda",
    },
    {
      quote: "Be not Afraid of anything. You will do Marvelous work. it is Fearlessness that brings Heaven even in a moment.",
      author: "Swami Vivekananda",
    },
    {
      quote:
        "All love is expansion, all selfishness is contraction. Love is therefore the only law of life. He who loves lives, he who is selfish is dying. Therefore love for love's sake, because it is the only law of life, just as you breathe to live.",
      author: "Swami Vivekananda",
    },
    {
      quote: "You cannot believe in God until you believe in yourself.",
      author: "Swami Vivekananda",
    },
    {
      quote: "Neither seek nor avoid, take what comes.",
      author: "Swami Vivekananda",
    },
    {
      quote: "Feel nothing, know nothing, do nothing, have nothing, give up all to God, and say utterly, 'Thy will be done.' We only dream this bondage. Wake up and let it go.",
      author: "Swami Vivekananda",
    },
    {
      quote: "Strength is Life, Weakness is Death. Expansion is Life, Contraction is Death. Love is Life, Hatred is Death.",
      author: "Swami Vivekananda",
    },
    {
      quote: "Comfort is no test of truth. Truth is often far from being comfortable.",
      author: "Swami Vivekananda",
    },
    {
      quote: "The fire that warms us can also consume us; it is not the fault of the fire.",
      author: "Swami Vivekananda",
    },
    {
      quote: "Learn Everything that is Good from Others, but bring it in, and in your own way absorb it; do not become others.",
      author: "Swami Vivekananda",
    },
    {
      quote: "Do one thing at a Time, and while doing it put your whole Soul into it to the exclusion of all else.",
      author: "Swami Vivekananda",
    },
    {
      quote:
        "Was there ever a more horrible blasphemy than the statement that all the knowledge of God is confined to this or that book? How dare men call God infinite, and yet try to compress Him within the covers of a little book!",
      author: "Swami Vivekananda",
    },
    {
      quote: "Whatever you think that you will be. If you think yourself weak, weak you will be; if you think yourself strong, you will be.",
      author: "Swami Vivekananda",
    },
    {
      quote: "All differences in this world are of degree, and not of kind, because oneness is the secret of everything.",
      author: "Swami Vivekananda",
    },
    {
      quote: "Each work has to pass through these stages—ridicule, opposition, and then acceptance. Those who think ahead of their time are sure to be misunderstood.",
      author: "Swami Vivekananda",
    },
    {
      quote:
        "We are responsible for what we are, and whatever we wish ourselves to be, we have the power to make ourselves. If what we are now has been the result of our own past actions, it certainly follows that whatever we wish to be in the future can be produced by our present actions; so we have to know how to act.",
      author: "Swami Vivekananda",
    },
    {
      quote: "Ask nothing; want nothing in return. Give what you have to give; it will come back to you, but do not think of that now.",
      author: "Swami Vivekananda",
    },
    {
      quote: "A fool may buy all the books in the world, and they will be in his library; but he will be able to read only those that he deserves to.",
      author: "Swami Vivekananda",
    },
    {
      quote: "Your own Self-Realization is the greatest service you can render the world.",
      author: "Ramana Maharshi",
    },
    {
      quote: "Happiness is your nature. It is not wrong to desire it. What is wrong is seeking it outside when it is inside.",
      author: "Ramana Maharshi",
    },
    {
      quote:
        "Your duty is to be and not to be this or that. 'I am that I am' sums up the whole truth. The method is summed up in the words 'Be still'. What does stillness mean? It means destroy yourself. Because any form or shape is the cause for trouble. Give up the notion that 'I am so and so'. All that is required to realize the Self is to be still. What can be easier than that?",
      author: "Ramana Maharshi",
    },
    {
      quote:
        "Whatever is destined not to happen will not happen, try as you may. Whatever is destined to happen will happen, do what you may to prevent it. This is certain. The best course, therefore, is to remain silent.",
      author: "Ramana Maharshi",
    },
    {
      quote:
        "Wanting to reform the world without discovering one's true self is like trying to cover the world with leather to avoid the pain of walking on stones and thorns. It is much simpler to wear shoes.",
      author: "Ramana Maharshi",
    },
    {
      quote: "You can only stop the flow of thoughts by refusing to have any interest in it.",
      author: "Ramana Maharshi",
    },
    {
      quote: "Let what comes come. Let what goes go. Find out what remains.",
      author: "Ramana Maharshi",
    },
    {
      quote: "There is neither creation nor destruction, neither destiny nor free will, neither path nor achievement. This is the final truth.",
      author: "Ramana Maharshi",
    },
    {
      quote: "There is neither Past nor Future. There is only the Present.",
      author: "Ramana Maharshi",
    },
    {
      quote:
        "If the mind falls asleep, awaken it. Then if it starts wandering, make it quiet. If you reach the state where there is neither sleep nor movement of mind, stay still in that, the natural (real) state.",
      author: "Ramana Maharshi",
    },
    {
      quote:
        "The greatest error of a man is to think that he is weak by nature, evil by nature. Every man is divine and strong in his real nature. What are weak and evil are his habits, his desires and thoughts, but not himself.",
      author: "Ramana Maharshi",
    },
    {
      quote: "All that is required to realise the Self is to “Be Still.”",
      author: "Ramana Maharshi",
    },
    {
      quote: "Realisation is not acquisition of anything new nor is it a new faculty. It is only removal of all camouflage.",
      author: "Ramana Maharshi",
    },
    {
      quote: "Eventually, all that one has learnt will have to be forgotten.",
      author: "Ramana Maharshi",
    },
    {
      quote: "If you go on working with the light available, you will meet your Master, as he himself will be seeking you.",
      author: "Ramana Maharshi",
    },
    {
      quote:
        "Become conscious of being conscious. Say or think “I am”, and add nothing to it. Be aware of the stillness that follows the “I am”. Sense your presence, the naked unveiled, unclothed beingness. It is untouched by young or old, rich or poor, good or bad, or any other attributes. It is the spacious womb of all creation, all form.",
      author: "Ramana Maharshi",
    },
    {
      quote: "The only useful purpose of the present birth is to turn within and realize the Self.",
      author: "Ramana Maharshi",
    },
    {
      quote:
        "Time is only an idea. There is only the Reality Whatever you think it is, it looks like that. If you call it time, it is time. If you call it existence, it is existence, and so on. After calling it time, you divide it into days and nights, months, years, hours, minutes, etc. Time is immaterial for the Path of Knowledge. But some of these rules and discipline are good for beginners.",
      author: "Ramana Maharshi",
    },
    {
      quote: "No one succeeds without effort... Those who succeed owe their success to perseverance.",
      author: "Ramana Maharshi",
    },
    {
      quote: "Everything in the world was my Guru.",
      author: "Ramana Maharshi",
    },
    {
      quote: "When one remains without thinking one understands another by means of the universal language of silence.",
      author: "Ramana Maharshi",
    },
    {
      quote: "Do what is right at a given moment and leave it behind.",
      author: "Ramana Maharshi",
    },
    {
      quote: "If you hold this feeling of ‘I’ long enough and strongly enough, the false ‘I’ will vanish leaving only the unbroken awareness of the real, immanent ‘I’, consciousness itself.",
      author: "Ramana Maharshi",
    },
    {
      quote:
        "Know that the eradication of the identification with the body is charity, spiritual austerity and ritual sacrifice; it is virtue, divine union and devotion; it is heaven, wealth, peace and truth; it is grace; it is the state of divine silence; it is the deathless death; it is jnana, renunciation, final liberation and bliss.",
      author: "Ramana Maharshi",
    },
    {
      quote:
        "What is illusion? M.: To whom is the illusion? Find it out. Then illusion will vanish. Generally people want to know about illusion and do not examine to whom it is. It is foolish. Illusion is outside and unknown. But the seeker is considered to be known and is inside. Find out what is immediate, intimate, instead of trying to find out what is distant and unknown.",
      author: "Ramana Maharshi",
    },
    {
      quote: "Remain still, with the conviction that the Self shines as everything yet nothing, within, without, and everywhere.",
      author: "Ramana Maharshi",
    },
    {
      quote: "Mind your business. Take care of what you came here for. Find the ‘I’ first and you may afterwards speak of other matters.",
      author: "Ramana Maharshi",
    },
    {
      quote:
        "Your concentration must come as easily as the breath. Fix yourself on one thing and try to hold onto it. All will come right. Meditation is sticking to one thought. That single thought keeps away other thoughts. The dissipated mind is a sign of its weakness. By constant meditation it gains strength.",
      author: "Ramana Maharshi",
    },
    {
      quote:
        "The explorers seek happiness in finding curiosities, discovering new lands and undergoing risks in adventures. They are thrilling. But where is pleasure found? Only within. Pleasure is not to be sought in the external world.",
      author: "Ramana Maharshi",
    },
    {
      quote:
        "The mind is by nature restless. Begin liberating it from its restlessness; give it peace; make it free from distractions; train it to look inward; make this a habit. This is done by ignoring the external world and removing the obstacles to peace of mind.",
      author: "Ramana Maharshi",
    },
  ];

  function getRandomQuote() {
    if (!Array.isArray(quotes) || quotes.length === 0) return { quote: "", author: "" };
    return quotes[Math.floor(Math.random() * quotes.length)];
  }

  const [selectedQuote, setSelectedQuote] = useState(() => getRandomQuote());

  return (
    <motion.div initial={{ opacity: 0, y: 27 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 27 }} transition={{ delay: 0.2, duration: 0.3 }}>
      <div className='card dailyInspirationCard'>
        <div className='topBar' onClick={onToggle} style={{ position: "relative" }}>
          <h3>Daily inspiration</h3>
          <small>GURU VAKYA</small>
          <small className='aktivniInfo'>{selectedQuote.author.split(" ").slice(-1)[0]}</small>
        </div>
        <motion.div className='container' initial={false} animate={isOpen ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: "easeInOut" }}>
          <AnimatePresence>
            {isOpen && (
              <motion.blockquote
                className='quoteContainer'
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ delay: 0.15, duration: 0.25 }}
                onClick={() => setSelectedQuote(getRandomQuote())}>
                <div>
                  <span className='quoteMark'>&quot;</span>
                  <span> {selectedQuote.quote} </span>
                  <span className='quoteMark'>&quot;</span>
                </div>
                <cite>- {selectedQuote.author}</cite>
              </motion.blockquote>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
}

DailyInspiration.propTypes = {
  isOpen: PropTypes.bool,
  onToggle: PropTypes.func,
};

import { motion } from "framer-motion";

export default function DailyInspiration() {
  const quotes = [
    { quote: "Love God with a pure heart.", author: "Bhagavan Sri Deep Narayan Mahaprabhuji" },
    {
      quote: "If you lead your life according to ethical principles you can fulfil your dharma. Accept the principle of morality and obey it as long as you live.",
      author: "Bhagavan Sri Deep Narayan Mahaprabhuji",
    },
    { quote: "Whatever you plan to do, do it with firm determination and your success will be assured.", author: "Bhagavan Sri Deep Narayan Mahaprabhuji" },
    { quote: "Always hold onto the Truth. Do not think negative and always do good.", author: "Bhagavan Sri Deep Narayan Mahaprabhuji" },
    {
      quote:
        "Do not give up what you have already started. There will always be obstacles in the way, just like roses always have thorns. Remove those obstacles with self-confidence and by God's grace your path will lead you to the goal.",
      author: "Bhagavan Sri Deep Narayan Mahaprabhuji",
    },
    { quote: "Do not be dependent upon others. Stand on your own feet. Trust in your abilities and God will help you.", author: "Bhagavan Sri Deep Narayan Mahaprabhuji" },
    {
      quote: "The success of your actions lies within the strength of your inner conviction and self-discipline. Do not lose your courage and never give up.",
      author: "Bhagavan Sri Deep Narayan Mahaprabhuji",
    },
    { quote: "Outer purity alone is not enough. Pure consciousness needs both inner and outer purity.", author: "Bhagavan Sri Deep Narayan Mahaprabhuji" },
    { quote: "Be truthful. Do not be a hypocrite.", author: "Bhagavan Sri Deep Narayan Mahaprabhuji" },
    { quote: "Be kind to all creatures and helpful at all times. In this way you will also help yourself.", author: "Bhagavan Sri Deep Narayan Mahaprabhuji" },
    { quote: "Beware of arrogance. Respect everyone equally.", author: "Bhagavan Sri Deep Narayan Mahaprabhuji" },
    { quote: "Whatever you think to possess is only transitory. Give up your false pride.", author: "Bhagavan Sri Deep Narayan Mahaprabhuji" },
    { quote: "Do not be proud of your wealth and knowledge. There will always be someone who is better than you.", author: "Bhagavan Sri Deep Narayan Mahaprabhuji" },
    { quote: "Always be honest and nothing will be lost. Dishonesty fails in the end.", author: "Bhagavan Sri Deep Narayan Mahaprabhuji" },
    { quote: "Do not praise yourself. Others may praise you but your greatness lies in modesty.", author: "Bhagavan Sri Deep Narayan Mahaprabhuji" },
    {
      quote:
        "Do not let yourself be discouraged by problems. Earthly life constantly flows between the banks of fortune and grief. One who loses courage won't reach the aim. Fulfil your duties with inner certainty and faith.",
      author: "Bhagavan Sri Deep Narayan Mahaprabhuji",
    },
    {
      quote: "Complete your tasks immediately. Do not postpone them till tomorrow. Realize your good intentions now because one moment is never like the next.",
      author: "Bhagavan Sri Deep Narayan Mahaprabhuji",
    },
    { quote: "Respect everyone equally. Always be ready to help. Without doing good, without right action, life lacks meaning.", author: "Bhagavan Sri Deep Narayan Mahaprabhuji" },
    {
      quote: "All pleasures are transient. Do not succumb to their outer appearance. True joy can be found in the service of all creatures and in this is the wisdom and meaning of life.",
      author: "Bhagavan Sri Deep Narayan Mahaprabhuji",
    },
    {
      quote:
        "Do not waste your time. Each second of your life is precious and irreplaceable. Time passed never comes back, time doesn't wait. If you don't keep up you'll be left behind, so use your time well.",
      author: "Bhagavan Sri Deep Narayan Mahaprabhuji",
    },
    {
      quote: "Everyone has good and bad habits. Do not see the bad in others, rather discover their virtues and emulate them. Learn good from everyone and everything.",
      author: "Bhagavan Sri Deep Narayan Mahaprabhuji",
    },
    {
      quote:
        "Do not allow bad habits to form which will be hard to give up and which may destroy your life. Cultivate good habits which will be helpful all life long. Avoid toxic substances such as tobacco, alcohol and drugs. These only invite illness and death into your house.",
      author: "Bhagavan Sri Deep Narayan Mahaprabhuji",
    },
    { quote: "Rise before sunrise and practise your spiritual exercises. Their benefits will accompany you the whole day.", author: "Bhagavan Sri Deep Narayan Mahaprabhuji" },
    { quote: "Be moderate with eating, as excessive craving for pleasure leads to laziness and disease.", author: "Bhagavan Sri Deep Narayan Mahaprabhuji" },
    { quote: "Respect your parents, your teachers and your Master. Live in love and harmony with your family.", author: "Bhagavan Sri Deep Narayan Mahaprabhuji" },
    { quote: "Always hold onto the Truth. Keep your word even if it costs your life.", author: "Bhagavan Sri Deep Narayan Mahaprabhuji" },
    { quote: "Your words and deeds should equal each other.", author: "Bhagavan Sri Deep Narayan Mahaprabhuji" },
    { quote: "Only pass on what is important. Hollow talk and gossip is lost time.", author: "Bhagavan Sri Deep Narayan Mahaprabhuji" },
    { quote: "Remain true to your partner and avoid situations that may lead you to be unfaithful.", author: "Bhagavan Sri Deep Narayan Mahaprabhuji" },
    {
      quote: "First impressions should never be the basis for your decisions. Wait until you have obtained further knowledge and in this way you will avoid unnecessary disappointments.",
      author: "Bhagavan Sri Deep Narayan Mahaprabhuji",
    },
    { quote: "Debts between friends not settled in time jeopardise the friendship. Give with an open heart, but weigh exactly what to do.", author: "Bhagavan Sri Deep Narayan Mahaprabhuji" },
    {
      quote:
        "Worldly things unnecessarily accumulated only become burdens and will bring sorrow. Material wealth is transient. Lakshmi, the Goddess of wealth, dislikes to be captured. The best possessions to handle are devotion, service and benefaction.",
      author: "Bhagavan Sri Deep Narayan Mahaprabhuji",
    },
    {
      quote: "Avoid words which you may later regret. Do nothing that will give away your principles, cause loss of self respect or sow the seeds of discord.",
      author: "Bhagavan Sri Deep Narayan Mahaprabhuji",
    },
    { quote: "Avoid unnecessary quarrels and avoid bad company. Keep away from hazards. Associate with good and wise people.", author: "Bhagavan Sri Deep Narayan Mahaprabhuji" },
    { quote: "Never speak ill of your parents or your Master. Do not accept malicious talk against them.", author: "Bhagavan Sri Deep Narayan Mahaprabhuji" },
    { quote: "Do not make enemies through thoughtless mistakes. Do not constantly complain about your problems.", author: "Bhagavan Sri Deep Narayan Mahaprabhuji" },
    { quote: "Try your best to promote the realization of ethical ideals. This will contribute to an existence of harmony.", author: "Bhagavan Sri Deep Narayan Mahaprabhuji" },
    { quote: "Learn to control your desires. Do not abandon yourself to dependence on your senses.", author: "Bhagavan Sri Deep Narayan Mahaprabhuji" },
    { quote: "Lethargy is one of your greatest enemies. Without effort you will not reach your aim. So give up your laziness.", author: "Bhagavan Sri Deep Narayan Mahaprabhuji" },
    {
      quote:
        "Do not waste your life in sensual living. Do not permit yourself to be confined to passions. Like the bee, drunk on the pleasant smell of the lotus flower, becomes caught in the closing bloom at sunset, so is a life wasted in transient, sensual pleasures. Do not abandon the quest for spiritual knowledge and development of consciousness.",
      author: "Bhagavan Sri Deep Narayan Mahaprabhuji",
    },
    { quote: "Do not ignore the laws of nature. Never disregard nature or nature will take its retribution.", author: "Bhagavan Sri Deep Narayan Mahaprabhuji" },
    { quote: "When the waves are high one should not dive for pearls.", author: "Bhagavan Sri Deep Narayan Mahaprabhuji" },
    { quote: "View the lives of Saints and important personalities as examples. Whatever someone achieves, is dependent on his or her own effort.", author: "Bhagavan Sri Deep Narayan Mahaprabhuji" },
    {
      quote: "Whoever speaks of the highest knowledge without having actually realized it, still lives in great ignorance. Even if they be very learned, their talk lacks perfection.",
      author: "Bhagavan Sri Deep Narayan Mahaprabhuji",
    },
    {
      quote: "If one wears the robe of an order and turns away from worldly life, yet is still not purified within and adheres not to right action, then their 'renunciation' is meaningless.",
      author: "Bhagavan Sri Deep Narayan Mahaprabhuji",
    },
    { quote: "Avoid places where you are not welcome.", author: "Bhagavan Sri Deep Narayan Mahaprabhuji" },
    { quote: "Wealth must be acquired in an honest way. Use it to achieve good. Earn your money through your own efforts, your own work.", author: "Bhagavan Sri Deep Narayan Mahaprabhuji" },
    { quote: "Do not just take, also learn to give. Constant taking creates a serious burden which is only unloaded by the act of giving.", author: "Bhagavan Sri Deep Narayan Mahaprabhuji" },
    { quote: "Be kind to every creature. Whomsoever hurts others, will themself be hurt.", author: "Bhagavan Sri Deep Narayan Mahaprabhuji" },
    { quote: "Treat others as you wish they should treat you. You will get back everything that you give.", author: "Bhagavan Sri Deep Narayan Mahaprabhuji" },
    { quote: "Love every living being at least as much as yourself.", author: "Bhagavan Sri Deep Narayan Mahaprabhuji" },
    { quote: "God's Light is in every creature. To love and serve them is to love and serve God.", author: "Bhagavan Sri Deep Narayan Mahaprabhuji" },
    {
      quote: "All beings are able to sleep, eat, drink and reproduce. The difference between people and animals is that the purpose of human birth is aimed at Self-knowledge and Self-realization.",
      author: "Bhagavan Sri Deep Narayan Mahaprabhuji",
    },
    { quote: "The perfect awakening of Self-realization takes place through love.", author: "Bhagavan Sri Deep Narayan Mahaprabhuji" },
    {
      quote:
        "Knowledge is limitless. Dive into it! Life is short and time passes quickly, so our experiences are limited. Let the past be gone and be aware that this moment also immediately belongs to the past. Make your future in the present. Therefore, brothers and sisters, wake up! Remember your duty and fulfil your dharma.",
      author: "Bhagavan Sri Deep Narayan Mahaprabhuji",
    },
  ];

  function getRandomQuote() {
    if (!Array.isArray(quotes) || quotes.length === 0) return { quote: "", author: "" };
    return quotes[Math.floor(Math.random() * quotes.length)];
  }
  const q = getRandomQuote();

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.5 }}>
      <div className='card dailyInspirationCard'>
        <div className='topBar' style={{ position: "relative" }}>
          <h3>Daily inspiration</h3>
          <small>QUOTES & MANTRAS</small>
          <small className='aktivniInfo'>Quote</small>
        </div>
        <div className={`container`}>
          <blockquote>
            <span className='quoteMark'>&quot;</span>
            <span> {q.quote} </span>
            <span className='quoteMark'>&quot;</span>
            <br />
            <cite>- {q.author}</cite>
          </blockquote>
        </div>
      </div>
    </motion.div>
  );
}

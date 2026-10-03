import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const topics = [
  {
    id: "heart-health",
    icon: "heart",
    title: "Heart Health",
    description: "Learn about keeping your heart healthy.",
    relatedTopics: ["blood-pressure", "exercise", "nutrition"],
    quickQuestions: [
      "How can I keep my heart healthy?",
      "What are common heart disease risk factors?",
      "What foods are good for heart health?",
    ],
    sections: {
      "What is heart health?":
        "Heart health refers to keeping your heart and cardiovascular system healthy through healthy lifestyle habits and regular health care.",
      "Common concerns":
        "Common heart-related concerns can include high blood pressure, high cholesterol and heart disease.",
      "Risk factors":
        "Risk factors can include smoking, unhealthy diet, physical inactivity, obesity, high blood pressure and high cholesterol.",
      Prevention:
        "Healthy eating, regular physical activity, avoiding smoking and managing health conditions can support heart health.",
      "General management":
        "Management depends on the individual and may include lifestyle changes, regular monitoring and advice from healthcare professionals.",
    },
  },
  {
    id: "blood-pressure",
    icon: "droplet",
    title: "Blood Pressure",
    description: "Understand blood pressure and healthy habits.",
    relatedTopics: ["heart-health", "exercise", "nutrition"],
    quickQuestions: [
      "What can cause high blood pressure?",
      "How can I lower my blood pressure naturally?",
      "Why is regular blood pressure checking important?",
    ],
    sections: {
      "What is blood pressure?":
        "Blood pressure is the force of blood pushing against the walls of your arteries as your heart pumps blood.",
      "Common symptoms":
        "High blood pressure often does not cause noticeable symptoms, which is why regular measurement is important.",
      "Risk factors":
        "Risk factors can include age, family history, excess weight, physical inactivity, high-sodium diet and alcohol use.",
      Prevention:
        "Healthy eating, physical activity, maintaining a healthy weight and regular blood pressure checks can help.",
      "General management":
        "Management may include lifestyle changes and, when prescribed by a healthcare professional, medication.",
    },
  },
  {
    id: "diabetes",
    icon: "stethoscope",
    title: "Diabetes",
    description: "Learn the basics of diabetes and healthy living.",
    relatedTopics: ["nutrition", "exercise", "blood-pressure"],
    quickQuestions: [
      "What causes diabetes?",
      "What are the common symptoms of diabetes?",
      "How can I prevent diabetes?",
    ],
    sections: {
      "What is diabetes?":
        "Diabetes is a chronic condition in which blood glucose levels are higher than normal because the body does not make enough insulin, does not use insulin effectively, or both.",
      "Common symptoms":
        "Possible symptoms include increased thirst, frequent urination, increased hunger, tiredness and unexplained weight changes.",
      "Risk factors":
        "Risk factors vary depending on the type of diabetes and can include family history, overweight or obesity, physical inactivity and age.",
      Prevention:
        "Some types of diabetes can be prevented or delayed through healthy eating, regular physical activity and maintaining a healthy weight.",
      "General management":
        "Management depends on the type of diabetes and may include healthy eating, physical activity, blood glucose monitoring and prescribed treatment.",
    },
  },
  {
    id: "sleep",
    icon: "moon",
    title: "Sleep",
    description: "Explore healthy sleep habits.",
    relatedTopics: ["exercise", "mental-wellbeing", "nutrition"],
    quickQuestions: [
      "How can I improve my sleep quality?",
      "How much sleep do adults need?",
      "What can cause poor sleep?",
    ],
    sections: {
      "What is healthy sleep?":
        "Healthy sleep means getting enough good-quality sleep on a regular basis.",
      "Common problems":
        "Common sleep problems include difficulty falling asleep, staying asleep or feeling rested after sleep.",
      "Risk factors":
        "Stress, irregular schedules, excessive screen use and some health conditions can affect sleep.",
      Prevention:
        "Keeping a regular sleep schedule, creating a comfortable sleep environment and limiting caffeine late in the day can support healthy sleep.",
      "General management":
        "Persistent sleep problems should be discussed with a healthcare professional.",
    },
  },
  {
    id: "nutrition",
    icon: "leaf",
    title: "Nutrition",
    description: "Learn about balanced nutrition and healthy eating.",
    relatedTopics: ["diabetes", "exercise", "hydration"],
    quickQuestions: [
      "What does a balanced diet include?",
      "What foods are good sources of protein?",
      "How can I improve my daily nutrition?",
    ],
    sections: {
      "What is healthy nutrition?":
        "Healthy nutrition means consuming a variety of foods that provide the nutrients and energy your body needs.",
      "Common concerns":
        "Common nutrition concerns include inadequate nutrient intake, excessive calorie intake and unbalanced diets.",
      "Risk factors":
        "Dietary habits, lifestyle, access to nutritious foods and certain health conditions can affect nutritional health.",
      Prevention:
        "Eating a variety of vegetables, fruits, whole grains and protein sources can support a balanced diet.",
      "General management":
        "Individual nutritional needs can vary, so professional advice may be useful for specific health conditions.",
    },
  },
  {
    id: "mental-wellbeing",
    icon: "brain",
    title: "Mental Wellbeing",
    description: "Learn about general mental wellbeing.",
    relatedTopics: ["sleep", "exercise", "hydration"],
    quickQuestions: [
      "How can I manage everyday stress?",
      "What can affect mental wellbeing?",
      "How can I support my emotional wellbeing?",
    ],
    sections: {
      "What is mental wellbeing?":
        "Mental wellbeing involves how people feel, think and cope with everyday life and challenges.",
      "Common concerns":
        "Stress, anxiety, low mood and difficulty coping can affect mental wellbeing.",
      "Risk factors":
        "Life events, chronic stress, social isolation and other factors can influence mental wellbeing.",
      Prevention:
        "Regular physical activity, healthy sleep, social connection and healthy coping strategies can support wellbeing.",
      "General management":
        "If emotional difficulties persist or interfere with daily life, talking with a qualified healthcare professional can help.",
    },
  },
  {
    id: "hydration",
    icon: "water",
    title: "Hydration",
    description: "Understand the importance of staying hydrated.",
    relatedTopics: ["nutrition", "exercise", "diabetes"],
    quickQuestions: [
      "How much water should I drink?",
      "What are common signs of dehydration?",
      "How can I stay hydrated during exercise?",
    ],
    sections: {
      "What is hydration?":
        "Hydration means maintaining an appropriate amount of water and fluids in the body.",
      "Common symptoms of dehydration":
        "Possible signs include thirst, dry mouth, dark urine, tiredness and dizziness.",
      "Risk factors":
        "Hot weather, exercise, illness and inadequate fluid intake can increase the risk of dehydration.",
      Prevention:
        "Drink fluids regularly and increase intake when appropriate during hot weather or physical activity.",
      "General management":
        "Severe dehydration can require urgent medical attention.",
    },
  },
  {
    id: "exercise",
    icon: "activity",
    title: "Exercise",
    description: "Learn how physical activity supports health.",
    relatedTopics: ["heart-health", "diabetes", "nutrition"],
    quickQuestions: [
      "What are the benefits of regular exercise?",
      "How can I start exercising safely?",
      "How much physical activity do adults need?",
    ],
    sections: {
      "What is physical activity?":
        "Physical activity includes body movement that uses energy, such as walking, cycling, sports and exercise.",
      Benefits:
        "Regular physical activity can support cardiovascular health, strength, mobility and overall wellbeing.",
      "Risk factors": "Inactivity can contribute to several health risks.",
      Prevention:
        "Starting gradually and choosing activities that fit your abilities can help build an active lifestyle.",
      "General management":
        "People with certain health conditions may need professional advice before starting a new exercise program.",
    },
  },
];

/* ---------- Topic Icons (blue SVG set) ---------- */
const TopicIcon = ({ name, size = 30 }) => {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.9,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style: { color: "#2563eb" },
  };

  switch (name) {
    case "heart":
      return (
        <svg {...common}>
          <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 1 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z" />
        </svg>
      );
    case "droplet":
      return (
        <svg {...common}>
          <path d="M12 2.7s6 6.3 6 11a6 6 0 1 1-12 0c0-4.7 6-11 6-11z" />
        </svg>
      );
    case "stethoscope":
      return (
        <svg {...common}>
          <path d="M4 3v6a5 5 0 0 0 10 0V3" />
          <path d="M9 14v2a5 5 0 0 0 10 0v-2" />
          <circle cx="19" cy="12" r="2" />
        </svg>
      );
    case "moon":
      return (
        <svg {...common}>
          <path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11z" />
        </svg>
      );
    case "leaf":
      return (
        <svg {...common}>
          <path d="M11 20A7 7 0 0 1 4 13c0-6 7-10 16-10 0 9-4 16-11 17z" />
          <path d="M4 20c3-5 7-8 12-9" />
        </svg>
      );
    case "brain":
      return (
        <svg {...common}>
          <path d="M9.5 3.5A3 3 0 0 0 6.5 6.5v.2A2.8 2.8 0 0 0 4.7 9c0 .7.3 1.4.8 1.9A2.8 2.8 0 0 0 4.7 13c0 1 .5 1.9 1.3 2.5A3 3 0 0 0 9 19.5c.6.3 1.3.5 2 .5V3.5a2 2 0 0 0-1.5 0z" />
          <path d="M14.5 3.5a3 3 0 0 1 3 3v.2A2.8 2.8 0 0 1 19.3 9c0 .7-.3 1.4-.8 1.9A2.8 2.8 0 0 1 19.3 13c0 1-.5 1.9-1.3 2.5A3 3 0 0 1 15 19.5c-.6.3-1.3.5-2 .5V3.5a2 2 0 0 1 1.5 0z" />
        </svg>
      );
    case "water":
      return (
        <svg {...common}>
          <path d="M12 2.7s6 6.3 6 11a6 6 0 1 1-12 0c0-4.7 6-11 6-11z" />
          <path d="M9.5 14a2.5 2.5 0 0 0 2.5 2.5" opacity="0.6" />
        </svg>
      );
    case "activity":
      return (
        <svg {...common}>
          <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
        </svg>
      );
  }
};

/* ---------- Inline Global Styles (injected once) ---------- */
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

    .ht-root {
      font-family: 'Plus Jakarta Sans', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      min-height: 100vh;
      position: relative;
      overflow-x: hidden;
      background: linear-gradient(135deg, #eef4ff 0%, #f7faff 40%, #eaf1ff 100%);
      color: #0f172a;
    }

    .ht-hex-bg {
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 0;
      overflow: hidden;
    }
    
    .ht-hex {
      position: absolute;
      width: 220px;
      height: 220px;
      background: linear-gradient(135deg, rgba(59,130,246,0.10), rgba(99,102,241,0.05));
      clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
      animation: ht-float 18s ease-in-out infinite;
      filter: blur(0.4px);
    }
    .ht-hex.h1 { top: -60px;  left: -80px;  animation-delay: 0s;   }
    .ht-hex.h2 { top: 20%;     right: -100px; animation-delay: -3s;  width: 300px; height: 300px; opacity: 0.8; }
    .ht-hex.h3 { bottom: -80px; left: 15%;   animation-delay: -6s;  width: 260px; height: 260px; }
    .ht-hex.h4 { top: 55%;     left: -70px;  animation-delay: -9s;  width: 180px; height: 180px; opacity: 0.7; }
    .ht-hex.h5 { bottom: 10%;  right: 8%;    animation-delay: -12s; width: 200px; height: 200px; opacity: 0.6; }

    @keyframes ht-float {
      0%, 100% { transform: translateY(0) rotate(0deg); }
      50%      { transform: translateY(-30px) rotate(8deg); }
    }

    .ht-blob {
      position: absolute;
      border-radius: 50%;
      filter: blur(90px);
      opacity: 0.55;
      animation: ht-pulse 10s ease-in-out infinite;
    }
    .ht-blob.b1 { width: 380px; height: 380px; background: #bfdbfe; top: 5%; left: 10%; }
    .ht-blob.b2 { width: 320px; height: 320px; background: #c7d2fe; bottom: 10%; right: 10%; animation-delay: -4s; }
    .ht-blob.b3 { width: 260px; height: 260px; background: #a5f3fc; top: 40%; right: 30%; animation-delay: -7s; }

    @keyframes ht-pulse {
      0%, 100% { transform: scale(1); opacity: 0.5; }
      50%      { transform: scale(1.15); opacity: 0.75; }
    }

    .ht-container {
      position: relative;
      z-index: 1;
      max-width: 1180px;
      margin: 0 auto;
      padding: 40px 24px 80px;
    }

    .ht-header {
      display: flex;
      flex-direction: column;
      gap: 14px;
      margin-bottom: 36px;
      animation: ht-fadeUp 0.7s ease both;
    }

    .ht-back-btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      width: fit-content;
      padding: 10px 16px;
      border-radius: 12px;
      border: 1px solid rgba(59,130,246,0.18);
      background: rgba(255,255,255,0.7);
      backdrop-filter: blur(10px);
      color: #1e40af;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.25s ease;
      box-shadow: 0 4px 14px rgba(59,130,246,0.08);
    }
    .ht-back-btn:hover {
      transform: translateY(-2px);
      background: #ffffff;
      border-color: rgba(59,130,246,0.4);
      box-shadow: 0 8px 22px rgba(59,130,246,0.18);
    }
    .ht-back-btn svg { transition: transform 0.25s ease; }
    .ht-back-btn:hover svg { transform: translateX(-3px); }

    .ht-title-row {
      display: flex;
      align-items: center;
      gap: 16px;
      flex-wrap: wrap;
    }

    .ht-logo {
  width: 52px;
  height: 52px;
  border-radius: 16px;
  background: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%);
  display: grid;
  place-items: center;
  color: #ffffff;
  box-shadow: 0 10px 24px rgba(59,130,246,0.35);
  animation: ht-glow 3s ease-in-out infinite;
  position: relative;
  overflow: hidden;
}

.ht-logo::before {
  content: "";
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.25), transparent 60%);
  pointer-events: none;
}

.ht-logo svg {
  position: relative;
  z-index: 1;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.15));
}
    @keyframes ht-glow {
      0%, 100% { box-shadow: 0 10px 24px rgba(59,130,246,0.35); }
      50%      { box-shadow: 0 10px 34px rgba(99,102,241,0.55); }
    }

    .ht-title {
      margin: 0;
      font-size: 38px;
      font-weight: 800;
      letter-spacing: -0.02em;
      background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 60%, #6366f1 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      line-height: 1.15;
    }

    .ht-subtitle {
      color: #64748b;
      font-size: 15.5px;
      margin: 0;
      max-width: 640px;
      line-height: 1.6;
    }

    .ht-search-wrap {
      position: relative;
      max-width: 640px;
      margin-bottom: 34px;
      animation: ht-fadeUp 0.8s ease both;
      animation-delay: 0.1s;
    }
    .ht-search-icon {
      position: absolute;
      left: 20px;
      top: 50%;
      transform: translateY(-50%);
      color: #3b82f6;
      pointer-events: none;
      transition: color 0.25s ease;
    }
    .ht-search {
      width: 100%;
      padding: 17px 22px 17px 52px;
      border-radius: 16px;
      border: 1px solid rgba(59,130,246,0.18);
      background: rgba(255,255,255,0.75);
      backdrop-filter: blur(12px);
      font-size: 15.5px;
      font-family: inherit;
      color: #0f172a;
      outline: none;
      box-sizing: border-box;
      transition: all 0.3s ease;
      box-shadow: 0 4px 20px rgba(59,130,246,0.06);
    }
    .ht-search::placeholder { color: #94a3b8; }
    .ht-search:focus {
      border-color: #3b82f6;
      background: #ffffff;
      box-shadow: 0 0 0 4px rgba(59,130,246,0.14), 0 8px 28px rgba(59,130,246,0.14);
      transform: translateY(-1px);
    }
    .ht-search:focus + .ht-search-icon,
    .ht-search-wrap:focus-within .ht-search-icon { color: #1d4ed8; }

    .ht-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      gap: 22px;
    }

    .ht-card {
      position: relative;
      background: rgba(255,255,255,0.78);
      backdrop-filter: blur(14px);
      border: 1px solid rgba(255,255,255,0.9);
      border-radius: 20px;
      padding: 26px 24px;
      cursor: pointer;
      overflow: hidden;
      transition: transform 0.35s cubic-bezier(.2,.8,.2,1), box-shadow 0.35s ease, border-color 0.35s ease;
      box-shadow: 0 6px 22px rgba(59,130,246,0.08);
      animation: ht-fadeUp 0.6s ease both;
    }
    .ht-card::before {
      content: "";
      position: absolute;
      inset: 0;
      border-radius: 20px;
      padding: 1px;
      background: linear-gradient(135deg, rgba(59,130,246,0.5), rgba(99,102,241,0.1), transparent 60%);
      -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
      -webkit-mask-composite: xor;
              mask-composite: exclude;
      opacity: 0;
      transition: opacity 0.35s ease;
      pointer-events: none;
    }
    .ht-card::after {
      content: "";
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: radial-gradient(circle at center, rgba(59,130,246,0.14), transparent 55%);
      opacity: 0;
      transition: opacity 0.4s ease;
      pointer-events: none;
    }
    .ht-card:hover {
      transform: translateY(-6px);
      border-color: rgba(59,130,246,0.35);
      box-shadow: 0 18px 40px rgba(59,130,246,0.22), 0 0 0 1px rgba(59,130,246,0.08);
    }
    .ht-card:hover::before { opacity: 1; }
    .ht-card:hover::after  { opacity: 1; }

    .ht-card-icon {
      width: 56px;
      height: 56px;
      border-radius: 16px;
      display: grid;
      place-items: center;
      background: linear-gradient(135deg, #e0edff 0%, #eef4ff 100%);
      margin-bottom: 16px;
      transition: transform 0.35s cubic-bezier(.2,.8,.2,1), background 0.35s ease;
      box-shadow: inset 0 0 0 1px rgba(59,130,246,0.12);
      position: relative;
      z-index: 1;
      color: #2563eb;
    }
    .ht-card:hover .ht-card-icon {
      transform: scale(1.08) rotate(-4deg);
      background: linear-gradient(135deg, #dbeafe 0%, #e0e7ff 100%);
    }

    .ht-card-title {
      margin: 0 0 8px;
      font-size: 17px;
      font-weight: 700;
      color: #0f172a;
      letter-spacing: -0.01em;
      position: relative;
      z-index: 1;
    }
    .ht-card-desc {
      margin: 0;
      font-size: 13.5px;
      color: #64748b;
      line-height: 1.55;
      position: relative;
      z-index: 1;
    }

    .ht-card-arrow {
      position: absolute;
      top: 22px;
      right: 20px;
      color: #3b82f6;
      opacity: 0;
      transform: translateX(-6px);
      transition: all 0.3s ease;
      z-index: 1;
    }
    .ht-card:hover .ht-card-arrow {
      opacity: 1;
      transform: translateX(0);
    }

    .ht-detail {
      background: rgba(255,255,255,0.85);
      backdrop-filter: blur(16px);
      border-radius: 24px;
      padding: 36px;
      border: 1px solid rgba(255,255,255,0.9);
      box-shadow: 0 20px 50px rgba(59,130,246,0.14);
      animation: ht-fadeUp 0.5s ease both;
      position: relative;
      overflow: hidden;
    }
    .ht-detail::before {
      content: "";
      position: absolute;
      top: 0; left: 0; right: 0;
      height: 4px;
      background: linear-gradient(90deg, #3b82f6, #6366f1, #06b6d4);
      border-radius: 24px 24px 0 0;
    }

    .ht-detail-head {
      display: flex;
      align-items: center;
      gap: 18px;
      margin-bottom: 10px;
      flex-wrap: wrap;
    }
    .ht-detail-icon {
      width: 66px;
      height: 66px;
      border-radius: 20px;
      display: grid;
      place-items: center;
      background: linear-gradient(135deg, #dbeafe 0%, #e0e7ff 100%);
      box-shadow: 0 10px 24px rgba(59,130,246,0.18);
      color: #2563eb;
    }
    .ht-detail-title {
      margin: 0;
      font-size: 28px;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: -0.02em;
    }

    .ht-save-btn {
      margin-left: auto;
      padding: 10px 16px;
      border-radius: 12px;
      border: 1px solid rgba(59,130,246,0.2);
      background: rgba(255,255,255,0.8);
      color: #2563eb;
      font-size: 13px;
      font-weight: 700;
      font-family: inherit;
      cursor: pointer;
      transition: all 0.25s ease;
    }
      .ht-save-btn:hover {
      background: #eff6ff;
      border-color: rgba(59,130,246,0.4);
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(59,130,246,0.15);
    }

    .ht-section {
      padding: 18px 0;
      border-bottom: 1px solid rgba(59,130,246,0.1);
      animation: ht-fadeUp 0.5s ease both;
    }
    .ht-section:last-of-type { border-bottom: none; }

    .ht-section h3 {
      margin: 0 0 8px;
      font-size: 15px;
      font-weight: 700;
      color: #2563eb;
      letter-spacing: 0.02em;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .ht-section h3::before {
      content: "";
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: linear-gradient(135deg, #3b82f6, #6366f1);
      box-shadow: 0 0 0 3px rgba(59,130,246,0.15);
    }
    .ht-section p {
      margin: 0;
      color: #475569;
      line-height: 1.75;
      font-size: 14.5px;
      padding-left: 14px;
    }

    /* Quick Questions block */
    .ht-quick {
       margin-top: 22px;
       padding: 20px;
       border-radius: 18px;
       background: linear-gradient(135deg, rgba(219,234,254,0.5) 0%, rgba(224,231,255,0.4) 100%);
       border: 1px solid rgba(59,130,246,0.15);
       animation: ht-fadeUp 0.6s ease both;
       animation-delay: 0.35s;
       position: relative;
       overflow: hidden;
}
    .ht-quick::before {
       content: "";
       position: absolute;
       top: -40%;
       right: -20%;
       width: 200px;
       height: 200px;
       background: radial-gradient(circle, rgba(59,130,246,0.18), transparent 70%);
       pointer-events: none;
}

   .ht-quick-title {
       display: flex;
       align-items: center;
       gap: 10px;
       font-size: 14.5px;
       font-weight: 700;
       color: #1e40af;
       letter-spacing: 0.01em;
       margin-bottom: 14px;
       position: relative;
       z-index: 1;
}
    .ht-quick-title svg {
       filter: drop-shadow(0 0 6px rgba(59,130,246,0.45));
       animation: ht-bulb-glow 2.5s ease-in-out infinite;
}

    @keyframes ht-bulb-glow {
       0%, 100% { filter: drop-shadow(0 0 4px rgba(59,130,246,0.35)); }
       50%      { filter: drop-shadow(0 0 12px rgba(99,102,241,0.75)); }
}

    .ht-quick-grid {
       display: flex;
       flex-wrap: wrap;
       gap: 10px;
       position: relative;
       z-index: 1;
}

    .ht-quick-btn {
       padding: 10px 16px;
       border-radius: 12px;
       border: 1px solid rgba(59,130,246,0.22);
       background: rgba(255,255,255,0.85);
       color: #1e40af;
       font-size: 13.5px;
       font-weight: 600;
       font-family: inherit;
       cursor: pointer;
       transition: all 0.25s cubic-bezier(.2,.8,.2,1);
       box-shadow: 0 3px 10px rgba(59,130,246,0.06);
}
    .ht-quick-btn:hover {
       background: linear-gradient(135deg, #3b82f6, #6366f1);
       color: #ffffff;
       border-color: transparent;
       transform: translateY(-2px);
       box-shadow: 0 10px 22px rgba(59,130,246,0.35);
}
    .ht-quick-btn:active {
       transform: translateY(0);
}

    .ht-cta {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      margin-top: 22px;
      padding: 15px 26px;
      border: none;
      border-radius: 14px;
      background: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%);
      color: #fff;
      font-size: 15px;
      font-weight: 700;
      font-family: inherit;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: all 0.3s ease;
      box-shadow: 0 10px 26px rgba(59,130,246,0.35);
      letter-spacing: 0.01em;
    }

    .ht-cta::after {
      content: "";
      position: absolute;
      top: 0; left: -100%;
      width: 100%; height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent);
      transition: left 0.6s ease;
    }
    .ht-cta:hover {
      transform: translateY(-2px);
      box-shadow: 0 16px 34px rgba(99,102,241,0.45);
    }
    .ht-cta:hover::after { left: 100%; }
    .ht-cta:active { transform: translateY(0); }

    .ht-detail-back {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 14px;
      border-radius: 10px;
      border: 1px solid rgba(59,130,246,0.18);
      background: rgba(255,255,255,0.6);
      color: #1e40af;
      font-size: 13.5px;
      font-weight: 600;
      font-family: inherit;
      cursor: pointer;
      margin-bottom: 20px;
      transition: all 0.25s ease;
    }
    .ht-detail-back:hover {
      background: #fff;
      border-color: rgba(59,130,246,0.4);
      transform: translateX(-2px);
    }

    .ht-empty {
      text-align: center;
      padding: 60px 20px;
      color: #64748b;
      animation: ht-fadeUp 0.5s ease both;
    }
    .ht-empty-icon {
      font-size: 48px;
      margin-bottom: 12px;
      opacity: 0.7;
    }

    @keyframes ht-fadeUp {
      from { opacity: 0; transform: translateY(14px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    .ht-card:nth-child(1) { animation-delay: 0.05s; }
    .ht-card:nth-child(2) { animation-delay: 0.10s; }
    .ht-card:nth-child(3) { animation-delay: 0.15s; }
    .ht-card:nth-child(4) { animation-delay: 0.20s; }
    .ht-card:nth-child(5) { animation-delay: 0.25s; }
    .ht-card:nth-child(6) { animation-delay: 0.30s; }
    .ht-card:nth-child(7) { animation-delay: 0.35s; }
    .ht-card:nth-child(8) { animation-delay: 0.40s; }

    @media (max-width: 640px) {
      .ht-container { padding: 24px 16px 60px; }
      .ht-title { font-size: 28px; }
      .ht-detail { padding: 24px; }
      .ht-detail-title { font-size: 22px; }
      .ht-grid { grid-template-columns: 1fr 1fr; gap: 14px; }
      .ht-card { padding: 18px; }
      .ht-card-icon { width: 46px; height: 46px; }
      .ht-card-title { font-size: 15px; }
      .ht-card-desc { font-size: 12.5px; }
      .ht-save-btn { margin-left: 0; }
      .ht-related-grid {
      grid-template-columns: 1fr;
    }

    .ht-related-card {
  padding: 14px;
    }
    }

    .ht-related {
  margin-top: 32px;
    }

    .ht-related-title {
  margin: 0 0 16px;
  font-size: 18px;
  font-weight: 800;
  color: #111827;
   }

    .ht-related-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
   }

    .ht-related-card {
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 16px;
  border: 1px solid rgba(59, 130, 246, 0.12);
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.85);
  text-align: left;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.25s ease;
   }

    .ht-related-card:hover {
      transform: translateY(-3px);
      border-color: rgba(59, 130, 246, 0.3);
      box-shadow: 0 8px 20px rgba(59, 130, 246, 0.1);
   }

    .ht-related-icon {
      flex-shrink: 0;
      width: 42px;
      height: 42px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 12px;
      background: #eff6ff;
      color: #2563eb;
   }

    .ht-related-content {
      min-width: 0;
      flex: 1;
   }

    .ht-related-content h4 {
      margin: 0 0 4px;
      font-size: 14px;
      font-weight: 800;
      color: #111827;
   }

    .ht-related-content p {
      margin: 0;
      font-size: 12px;
      line-height: 1.5;
      color: #6b7280;
   }

    .ht-related-arrow {
      flex-shrink: 0;
      font-size: 18px;
      font-weight: 700;
      color: #2563eb;
   }
  `}</style>
);

/* ---------- UI Icons ---------- */
const SearchIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

const ArrowLeftIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.4"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M19 12H5" />
    <path d="m12 19-7-7 7-7" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.4"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
);

const SparkleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path
      d="M12 2l1.9 5.8L19.7 9.7 13.9 11.6 12 17.4 10.1 11.6 4.3 9.7 10.1 7.8 12 2z"
      opacity="0.9"
    />
    <path
      d="M19 14l.9 2.6L22.5 17.5 19.9 18.4 19 21l-.9-2.6L15.5 17.5 18.1 16.6 19 14z"
      opacity="0.6"
    />
  </svg>
);

const BulbIcon = ({ size = 18 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* Bulb glass */}
    <path d="M9 18h6" stroke="#2563eb" />
    <path d="M10 21h4" stroke="#2563eb" />
    <path
      d="M12 3a6 6 0 0 0-4 10.5c.7.7 1.2 1.5 1.5 2.5h5c.3-1 .8-1.8 1.5-2.5A6 6 0 0 0 12 3z"
      stroke="#3b82f6"
      fill="rgba(59,130,246,0.12)"
    />
    {/* Filament glow */}
    <path d="M12 8v3" stroke="#6366f1" strokeWidth="2.2" />
  </svg>
);

/* ---------- Component ---------- */
const HealthTopics = () => {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [savedTopics, setSavedTopics] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("mediAI_saved_topics")) || [];
    setSavedTopics(saved);
  }, []);

  const filteredTopics = useMemo(
    () =>
      topics.filter((topic) =>
        topic.title.toLowerCase().includes(search.toLowerCase()),
      ),
    [search],
  );

  const relatedTopics =
    selectedTopic?.relatedTopics
      ?.map((id) => topics.find((topic) => topic.id === id))
      .filter(Boolean) || [];

  const handleAskMediAI = () => {
    const question = `Explain ${selectedTopic.title}`;
    navigate("/ai-assistant", { state: { question } });
  };

  const handleQuickQuestion = (question) => {
    navigate("/ai-assistant", { state: { question } });
  };

  const handleToggleSave = (topicId) => {
    let updatedSavedTopics;

    if (savedTopics.includes(topicId)) {
      updatedSavedTopics = savedTopics.filter((id) => id !== topicId);
    } else {
      updatedSavedTopics = [...savedTopics, topicId];
    }

    setSavedTopics(updatedSavedTopics);

    localStorage.setItem(
      "mediAI_saved_topics",
      JSON.stringify(updatedSavedTopics),
    );
  };

  return (
    <div className="ht-root">
      <GlobalStyles />

      <div className="ht-hex-bg" aria-hidden="true">
        <div className="ht-blob b1" />
        <div className="ht-blob b2" />
        <div className="ht-blob b3" />
        <div className="ht-hex h1" />
        <div className="ht-hex h2" />
        <div className="ht-hex h3" />
        <div className="ht-hex h4" />
        <div className="ht-hex h5" />
      </div>

      <div className="ht-container">
        <header className="ht-header">
          <button
            className="ht-back-btn"
            onClick={() => navigate("/dashboard")}
          >
            <ArrowLeftIcon /> Back to Dashboard
          </button>

          <div className="ht-title-row">
            <div className="ht-logo">
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3" />
                <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4" />
                <circle cx="20" cy="10" r="2" />
              </svg>
            </div>
            <h1 className="ht-title">Health Topics</h1>
          </div>

          <p className="ht-subtitle">
            Explore trusted general health information and learn more about
            different health topics — curated to help you make informed choices.
          </p>
        </header>

        {!selectedTopic && (
          <div className="ht-search-wrap">
            <input
              type="text"
              className="ht-search"
              placeholder="Search health topics..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <span className="ht-search-icon">
              <SearchIcon />
            </span>
          </div>
        )}

        {selectedTopic && (
          <section className="ht-detail">
            <button
              className="ht-detail-back"
              onClick={() => setSelectedTopic(null)}
            >
              <ArrowLeftIcon /> Back to Topics
            </button>

            <div className="ht-detail-head">
              <div className="ht-detail-icon">
                <TopicIcon name={selectedTopic.icon} size={34} />
              </div>

              <h2 className="ht-detail-title">{selectedTopic.title}</h2>

              <button
                className="ht-save-btn"
                onClick={() => handleToggleSave(selectedTopic.id)}
              >
                {savedTopics.includes(selectedTopic.id)
                  ? "♥ Saved"
                  : "♡ Save Topic"}
              </button>
            </div>

            {Object.entries(selectedTopic.sections).map(
              ([heading, content], idx) => (
                <div
                  key={heading}
                  className="ht-section"
                  style={{ animationDelay: `${0.05 * idx}s` }}
                >
                  <h3>{heading}</h3>
                  <p>{content}</p>
                </div>
              ),
            )}

            {/* Quick Questions */}
            {selectedTopic.quickQuestions && (
              <div className="ht-quick">
                <div className="ht-quick-title">
                  <BulbIcon />
                  <span>Quick Questions</span>
                </div>

                <div className="ht-quick-grid">
                  {selectedTopic.quickQuestions.map((question) => (
                    <button
                      key={question}
                      className="ht-quick-btn"
                      onClick={() => handleQuickQuestion(question)}
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {relatedTopics.length > 0 && (
              <div className="ht-related">
                <h3 className="ht-related-title">Related Topics</h3>

                <div className="ht-related-grid">
                  {relatedTopics.map((topic) => (
                    <button
                      key={topic.id}
                      className="ht-related-card"
                      onClick={() => setSelectedTopic(topic)}
                    >
                      <div className="ht-related-icon">
                        <TopicIcon name={topic.icon} size={22} />
                      </div>

                      <div className="ht-related-content">
                        <h4>{topic.title}</h4>
                        <p>{topic.description}</p>
                      </div>

                      <span className="ht-related-arrow">→</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button className="ht-cta" onClick={handleAskMediAI}>
              <SparkleIcon />
              Ask MediAI about {selectedTopic.title}
            </button>
          </section>
        )}

        {!selectedTopic && (
          <>
            <div className="ht-grid">
              {filteredTopics.map((topic) => (
                <article
                  key={topic.id}
                  className="ht-card"
                  onClick={() => setSelectedTopic(topic)}
                >
                  <div className="ht-card-icon">
                    <TopicIcon name={topic.icon} size={30} />
                  </div>
                  <h3 className="ht-card-title">{topic.title}</h3>
                  <p className="ht-card-desc">{topic.description}</p>
                  <span className="ht-card-arrow">
                    <ArrowRightIcon />
                  </span>
                </article>
              ))}
            </div>

            {filteredTopics.length === 0 && (
              <div className="ht-empty">
                <div className="ht-empty-icon">🔍</div>
                <p>No health topics found.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default HealthTopics;

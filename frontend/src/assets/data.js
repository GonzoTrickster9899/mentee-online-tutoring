import Mathematics from '../assets/subjects/mathematics.png'
import Science from '../assets/subjects/science.png'
import Commerce from '../assets/subjects/commerce.png'
import Computer from '../assets/subjects/computer.png'
import Languages from '../assets/subjects/languages.png'
import Arts from '../assets/subjects/arts.png'

import tutor1 from "../assets/tutor1.png"
import tutor2 from "../assets/tutor2.png"
import tutor3 from "../assets/tutor3.png"
import tutor4 from "../assets/tutor4.png"
import tutor5 from "../assets/tutor5.png"
import tutor6 from "../assets/tutor6.png"
import tutor7 from "../assets/tutor7.png"
import tutor8 from "../assets/tutor8.png"
import tutor9 from "../assets/tutor9.png"
import tutor10 from "../assets/tutor10.png"
import tutor11 from "../assets/tutor11.png"
import tutor12 from "../assets/tutor12.png"
import tutor13 from "../assets/tutor13.png"
import tutor14 from "../assets/tutor14.png"

// Blogs
import blog1 from "../assets/blogs/blog1.jpg"
import blog2 from "../assets/blogs/blog2.jpg"
import blog3 from "../assets/blogs/blog3.jpg"
import blog4 from "../assets/blogs/blog4.jpg"
import blog5 from "../assets/blogs/blog5.jpg"
import blog6 from "../assets/blogs/blog6.jpg"
import blog7 from "../assets/blogs/blog7.jpg"
import blog8 from "../assets/blogs/blog8.jpg"


export const subjectsData = [
    {
        name: 'Mathematics',
        image: Mathematics
    },
    {
        name: 'Science',
        image: Science
    },
    {
        name: 'Commerce',
        image: Commerce
    },
    {
        name: 'Computer',
        image: Computer
    },
    {
        name: 'Languages',
        image: Languages
    },
    {
        name: 'Arts',
        image: Arts
    },
]

// Tutors data

export const tutors = [
  {
    _id: 'tut1',
    name: 'Sarah Thompson',
    image: tutor1,
    subject: 'Mathematics',
    qualification: 'MSc Mathematics',
    experience: '5 Years',
    about:
      'Sarah specializes in high school and college-level mathematics, focusing on calculus and algebra. She uses a step-by-step approach to build strong foundations in mathematical principles. Her goal is to simplify complex equations and make learning enjoyable through real-life applications and interactive sessions.',
    fees: 10,
    location: {
      city: 'Los Angeles',
      country: 'United States',
    }
  },
  {
    _id: 'tut2',
    name: 'Michael Lee',
    image: tutor2,
    subject: 'Computer',
    qualification: 'MSc Computer Science',
    experience: '8 Years',
    about:
      'Michael brings a deep understanding of computer science fundamentals, helping students grasp programming, data structures, and software development. He emphasizes problem-solving and logical thinking. With hands-on project experience, he ensures students are industry-ready and confident in real-world scenarios.',
    fees: 15,
    location: {
      city: 'San Francisco',
      country: 'United States'
    }
  },
  {
    _id: 'tut3',
    name: 'Emily Davis',
    image: tutor3,
    subject: 'Languages',
    qualification: 'MA English Literature',
    experience: '6 Years',
    about:
      'Emily focuses on enhancing reading comprehension and analytical writing skills. Her sessions include literature analysis, grammar correction, and vocabulary development. She fosters a love for language and literature, encouraging critical thinking through engaging discussions and creative writing exercises.',
    fees: 25,
    location: {
      city: 'Chicago',
      country: 'United States'
    }
  },
  {
    _id: 'tut4',
    name: 'David Rodriguez',
    image: tutor4,
    subject: 'Science',
    qualification: 'MSc Chemistry',
    experience: '7 Years',
    about:
      'David simplifies complex chemical concepts, making them accessible and engaging for students. He incorporates experiments, models, and visuals in his lessons. David emphasizes scientific thinking, exam preparation strategies, and supports students in mastering theory as well as lab work.',
    fees: 10,
    location: {
      city: 'Houston',
      country: 'United States'
    }
  },
  {
    _id: 'tut5',
    name: 'Robert Clark',
    image: tutor5,
    subject: 'Commerce',
    qualification: 'MBA Finance',
    experience: '9 Years',
    about:
      'Robert offers in-depth knowledge in finance and accounting, helping students excel in core commerce subjects. He explains financial statements, market analysis, and business strategies. Robert’s approach includes real-world case studies and practical examples to clarify abstract concepts.',
    fees: 20,
    location: {
      city: 'Seattle',
      country: 'United States'
    }
  },
  {
    _id: 'tut6',
    name: 'James Wilson',
    image: tutor6,
    subject: 'Arts',
    qualification: 'MA Fine Arts',
    experience: '4 Years',
    about:
      'James engages students with compelling narratives, connecting historical events and artistic movements. He encourages creative expression through drawing, painting, and critique. His lessons blend theory with practical work, allowing students to explore and grow their artistic identity.',
    fees: 15,
    location: {
      city: 'Boston',
      country: 'United States'
    }
  },
  {
    _id: 'tut7',
    name: 'Patricia Martinez',
    image: tutor7,
    subject: 'Languages',
    qualification: 'BA Japanese Studies',
    experience: '5 Years',
    about:
      'Patricia helps students master the Japanese language through interactive sessions focused on conversation, grammar, and cultural understanding. She tailors her teaching to beginner, intermediate, and advanced learners, integrating real-life situations and kanji recognition for better fluency and confidence.',
    fees: 25,
    location: {
      city: 'Miami',
      country: 'United States'
    }
  },  
  {
    _id: 'tut8',
    name: 'Linda Nguyen',
    image: tutor8,
    subject: 'Computer',
    qualification: 'MSc Computer Science',
    experience: '6 Years',
    about:
      'Linda specializes in programming languages and algorithms, preparing students for coding interviews, competitive exams, and projects. She focuses on hands-on coding, debugging, and software design. Her sessions are structured around real-world problems and current technology trends.',
    fees: 10,
    location: {
      city: 'Austin',
      country: 'United States'
    }
  },
  {
    _id: 'tut9',
    name: 'William Walker',
    image: tutor9,
    subject: 'Commerce',
    qualification: 'MA Economics',
    experience: '7 Years',
    about:
      'William breaks down economic theories and models, making them relatable with real-life examples. He teaches both micro and macroeconomics, focusing on current events and market trends. His goal is to develop analytical skills and a deep understanding of economic principles.',
    fees: 15,
    location: {
      city: 'Denver',
      country: 'United States'
    }
  },
  {
    _id: 'tut10',
    name: 'Jennifer Lewis',
    image: tutor10,
    subject: 'Languages',
    qualification: 'Certified SAT Instructor',
    experience: '10 Years',
    about:
      'Jennifer has a proven track record of boosting students’ SAT scores through tailored instruction in reading and writing. She focuses on exam strategies, time management, and practice tests. Her supportive approach builds confidence and ensures measurable progress.',
    fees: 20,
    location: {
      city: 'Atlanta',
      country: 'United States'
    }
  },
  {
    _id: 'tut11',
    name: 'Christopher Allen',
    image: tutor11,
    subject: 'Mathematics',
    qualification: 'MSc Mathematics',
    experience: '8 Years',
    about:
      'Christopher helps students understand advanced mathematics concepts with clarity. His teaching involves problem-solving techniques, conceptual clarity, and real-world applications. He focuses on building confidence and preparing students for academic and competitive exams with consistent support.',
    fees: 10,
    location: {
      city: 'Philadelphia',
      country: 'United States'
    }
  },
  {
    _id: 'tut12',
    name: 'Barbara Hall',
    image: tutor12,
    subject: 'Arts',
    qualification: 'MA Art History',
    experience: '5 Years',
    about:
      'Barbara brings art to life, helping students appreciate and analyze masterpieces across time periods. She integrates visual aids, storytelling, and critical analysis. Her teaching style encourages appreciation of artistic expression and deepens understanding of cultural contexts.',
    fees: 25,
    location: {
      city: 'Los Angeles',
      country: 'United States'
    }
  },
  {
    _id: 'tut13',
    name: 'Thomas Hernandez',
    image: tutor13,
    subject: 'Science',
    qualification: 'MSc Physics',
    experience: '9 Years',
    about:
      'Thomas simplifies complex chemical concepts, making them accessible and engaging for students. He incorporates experiments, models, and visuals in his lessons. Thomas emphasizes scientific thinking, exam preparation strategies, and supports students in mastering theory as well as lab work.',
    fees: 10,
    location: {
      city: 'New Orleans',
      country: 'United States'
    }
  },
  {
    _id: 'tut14',
    name: 'Elizabeth Young',
    image: tutor14,
    subject: 'Commerce',
    qualification: 'MBA Business Administration',
    experience: '7 Years',
    about:
      'Elizabeth simplifies statistical and business concepts, guiding students through data analysis, management theory, and financial planning. Her teaching involves real-world case studies, group discussions, and project-based learning to prepare students for business challenges.',
    fees: 15,
    location: {
      city: 'New Orleans',
      country: 'United States'
    }
  },
];



export const blogs = [
  { title: "Top Study Tips for Online Learners", category: "Productivity", image: blog1 },
  { title: "Latest Trends in Online Education 2025", category: "E-Learning", image: blog2 },
  { title: "How to Find the Right Online Tutor", category: "Tutoring", image: blog3 },
  { title: "Why Online Tutoring is the Future of Learning", category: "EdTech", image: blog4 },
  { title: "Smart Learning Strategies for Students", category: "Study Skills", image: blog5 },
  { title: "Emerging Innovations in Digital Classrooms 2025", category: "Technology", image: blog6 },
  { title: "Best Online Learning Platforms in 2025", category: "Resources", image: blog7 },
  { title: "How Virtual Tutoring is Transforming Education", category: "Online Learning", image: blog8 }
];


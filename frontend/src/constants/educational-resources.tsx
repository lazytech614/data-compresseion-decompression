import { Zap, Play, Brain, Sparkles, TrendingUp, Target } from "lucide-react";

export const EDUCATIONAL_RESOURCES = [
  {
    title: 'Introduction to Data Compression',
    description: 'Comprehensive guide covering fundamental concepts',
    url: 'https://web.stanford.edu/class/ee398a/handouts/lectures/',
    type: 'Course Material',
    level: 'Beginner'
  },
  {
    title: 'The Data Compression Book',
    description: 'Classic textbook by Mark Nelson and Jean-Loup Gailly',
    url: 'https://theswissbay.ch/pdf/Gentoomen%20Library/Information%20Theory/The%20Data%20Compression%20Book%202nd%20Ed%20-%20Mark%20Nelson.pdf',
    type: 'Book',
    level: 'Intermediate'
  },
  {
    title: 'MIT OpenCourseWare - Information Theory',
    description: 'Free course materials from MIT covering compression theory',
    url: 'https://ocw.mit.edu/courses/electrical-engineering-and-computer-science/',
    type: 'Course',
    level: 'Advanced'
  },
  {
    title: 'Google Developers - Compression Guide',
    description: 'Practical guide for web developers on compression techniques',
    url: 'https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency',
    type: 'Tutorial',
    level: 'Intermediate'
  },
  {
    title: 'RFC 1951 - DEFLATE Specification',
    description: 'Official specification for the DEFLATE compression algorithm',
    url: 'https://tools.ietf.org/html/rfc1951',
    type: 'Specification',
    level: 'Advanced'
  },
  {
    title: 'Data Compression Explained',
    description: 'Interactive visualizations of compression algorithms',
    url: 'https://www.data-compression.com/',
    type: 'Interactive',
    level: 'All Levels'
  }
];

export const DID_YOU_KNOW_FACTS = [
  {
    icon: <Zap className="text-yellow-400" size={24} />,
    fact: "The PNG format can achieve lossless compression ratios of up to 95% for certain types of images!",
    category: "Amazing Stats"
  },
  {
    icon: <Brain className="text-pink-400" size={24} />,
    fact: "Huffman coding was invented by David Huffman as a student assignment in 1952, yet it's still widely used today!",
    category: "History"
  },
  {
    icon: <Sparkles className="text-purple-400" size={24} />,
    fact: "Your brain naturally compresses information - that's why you remember the gist of stories rather than every word!",
    category: "Mind Blown"
  },
  {
    icon: <TrendingUp className="text-green-400" size={24} />,
    fact: "Netflix saves over $1 billion annually by using advanced video compression algorithms!",
    category: "Industry Impact"
  },
  {
    icon: <Target className="text-blue-400" size={24} />,
    fact: "The ZIP format combines LZ77 compression with Huffman coding for optimal file reduction!",
    category: "Tech Deep Dive"
  }
];

export const INTERACTIVE_DEMOS = [
  {
    title: "Huffman Tree Visualizer",
    description: "Watch how Huffman trees are built step by step",
    complexity: "Beginner",
    estimatedTime: "5 min",
    icon: <Play className="text-green-400" size={20} />
  },
  {
    title: "LZ77 String Matching",
    description: "See how LZ77 finds and replaces repeated patterns",
    complexity: "Intermediate",
    estimatedTime: "8 min",
    icon: <Brain className="text-blue-400" size={20} />
  },
  {
    title: "Compression Ratio Calculator",
    description: "Test different algorithms on your own text",
    complexity: "All Levels",
    estimatedTime: "3 min",
    icon: <Zap className="text-purple-400" size={20} />
  }
];
import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const Testimonials = () => {
  const testimonials = [
    {
      name: "Abhishek Pandey",
      university: "Harvard University, USA",
      program: "Master's in Computer Science",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
      text: "StudyAbroad made my dream of studying at Harvard a reality. Their expert guidance through the application process was invaluable. I couldn't have done it without them!",
      gradient: "from-blue-50 to-purple-50",
      color: "blue-600"
    },
    {
      name: "Ram Khadka",
      university: "Oxford University, UK",
      program: "PhD in Engineering",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
      text: "The team helped me secure admission to Oxford with a full scholarship. Their personalized approach and attention to detail made all the difference in my application.",
      gradient: "from-green-50 to-teal-50",
      color: "green-600"
    },
    {
      name: "Priya Sharma",
      university: "University of Toronto, Canada",
      program: "MBA in Business Analytics",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face",
      text: "From visa processing to university selection, they handled everything professionally. Now I'm pursuing my MBA at one of Canada's top universities!",
      gradient: "from-purple-50 to-pink-50",
      color: "purple-600"
    },
    {
      name: "Sachin Pantha",
      university: "University of Melbourne, Australia",
      program: "Master's in Data Science",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face",
      text: "The support didn't end after admission. They helped with accommodation, orientation, and even career guidance. Truly a comprehensive service!",
      gradient: "from-orange-50 to-red-50",
      color: "orange-600"
    },
    {
      name: "Smirti Pandey",
      university: "Technical University Munich, Germany",
      program: "Master's in Mechanical Engineering",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop&crop=face",
      text: "They made studying in Germany possible for me with their excellent visa guidance and university partnerships. The process was smooth and stress-free!",
      gradient: "from-indigo-50 to-blue-50",
      color: "indigo-600"
    }
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 5000,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 0,
    cssEase: 'linear',
    pauseOnHover: true,
    pauseOnFocus: true,
    pauseOnDotsHover: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          speed: 5000,
          autoplaySpeed: 0,
          cssEase: 'linear'
        }
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          speed: 3000,
          autoplaySpeed: 3000,
          cssEase: 'ease-in-out',
          fade: false
        }
      }
    ]
  };

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16" data-aos="fade-up">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Our Success Stories
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
            Hear from students who achieved their dreams with our guidance
          </p>
        </div>

        <Slider {...settings}>
          {testimonials.map((testimonial, index) => (
            <div key={index} className="px-4">
              <div className={`bg-gradient-to-br ${testimonial.gradient} p-8 rounded-2xl shadow-lg min-h-[300px] flex flex-col justify-between`}>
                <div className="flex items-center mb-6">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h4 className="font-bold text-gray-800">{testimonial.name}</h4>
                    <p className={`text-${testimonial.color} text-sm`}>{testimonial.university}</p>
                    <div className="flex text-yellow-400 mt-1">
                      ★★★★★
                    </div>
                  </div>
                </div>
                <p className="text-gray-700 italic mb-4">
                  "{testimonial.text}"
                </p>
                <div className="text-sm text-gray-500">
                  {testimonial.program}
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default Testimonials;
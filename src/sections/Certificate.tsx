"use client";

import NodeJsCertificate from "@/assets/certificates/nodejs_certificate.jpg";
import CompetitionCertificate from "@/assets/certificates/competition_certificate.jpeg";
import FlutterCertificate from "@/assets/certificates/flutter_certificate.jpeg";
import PKLCertificate from "@/assets/certificates/pkl_certification.jpeg";
import UjikomCertificate from "@/assets/certificates/ujikom_certification.jpeg";
import Image from "next/image";
import CheckCircleIcon from "@/assets/icons/check-circle.svg";
import ArraowUpRightIcon from "@/assets/icons/arrow-up-right.svg";
import { Card } from "@/components/Card";
import React from "react";
import { motion } from "framer-motion";
import { LampContainer } from "@/components/ui/LampContainer";

const certificates = [
  {
    company: "Inter-School Competition",
    year: "13 April 2023",
    title: "Web Technologies",
    results: [
      { title: "Simple Snake Game" },
      { title: "Create Website Using Wordpress" },
      { title: "Create Website Using Laravel and Vue.JS" },
    ],
    link: "https://drive.google.com/drive/folders/123QStjlkDknO4zO02G2fpNgVZ6-7FaET?usp=sharing",
    image: CompetitionCertificate,
  },
  {
    company: "Udemy",
    year: "11 November 2024",
    title: "NodeJS: Beginner to Advanced",
    results: [
      { title: "NodeJS" },
      { title: "NodeJS Basics" },
      { title: "NodeJS Standard Library" },
      { title: "NodeJS RESTful API" },
    ],
    link: "https://www.udemy.com/course/nodejs-pemula-sampai-mahir/learn/lecture/32742654#overview",
    image: NodeJsCertificate,
  },
  {
    company: "Udemy",
    year: "10 April 2024",
    title: "Flutter Intermediate",
    results: [
      { title: "Scalable Architecture" },
      { title: "Robust State Management" },
      { title: "Advanced Features Integration" },
      { title: "Efficient Networking" },
    ],
    link: "https://www.udemy.com/course/flutterindonesiakopianan/?couponCode=ST14MT150425G1",
    image: FlutterCertificate,
  },
  {
    company: "SINOVATIF",
    year: "8 August 2022",
    title: "PKL Certification",
    results: [
      { title: "Understanding Professional Work Culture" },
      { title: "Adapting to New Technologies" },
      { title: "Web Development with Laravel Breeze" },
      { title: "Final Project: Student Attendance System" },
    ],
    link: "https://www.linkedin.com/company/pt-sinergi-nusa-inovatif/?originalSubdomain=id",
    image: PKLCertificate,
  },
  {
    company: "SMKN x Inovindo",
    year: "1 April 2023",
    title: "Competency Test",
    results: [
      { title: "Developed a School Tuition Payment System" },
      { title: "Implemented Online Payment Integration" },
      { title: "Presented Project to Mentors" },
      { title: "Achieved Excellent Competency Scores" },
    ],
    link: "https://inovindo.co.id/",
    image: UjikomCertificate,
  },
];

export const CertificatesSection = () => {
  return (
    <section id="skills" className="pb-16 lg:py-24">
      <LampContainer>
        <motion.div
          initial={{ opacity: 0.5, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
        >
          <div className="flex justify-center">
            <p className="uppercase font-semibold tracking-widest bg-gradient-to-r from-emerald-300 to-sky-400 text-transparent bg-clip-text text-center">
              REAL-WORLD GROWTH
            </p>
          </div>
          <h2 className="font-serif text-3xl md:text-5xl text-center mt-6">
            Verified Certifications
          </h2>
          <p className="text-center md:text-lg lg:text-xl text-white/60 mt-4 max-w-md mx-auto">
            Discover the credentials I’ve earned on my journey of continuous
            learning.
          </p>
        </motion.div>
      </LampContainer>
      <div className="container">
        <div className="flex flex-col -mt-10 md:-mt-20 gap-20">
          {certificates.map((project, index) => (
            <Card
              key={project.title}
              className="px-8 pt-8 pb-0 md:px-10 md:pt-12 lg:pt-16 lg:px-20 sticky"
              style={{
                top: `calc(64px + ${index * 40}px)`,
              }}
            >
              <div className="lg:grid lg:grid-cols-2 lg:gap-16">
                <div className="lg:pb-16">
                  <div className="bg-gradient-to-r from-emerald-300 to-sky-400 inline-flex gap-2 font-bold uppercase tracking-widest text-sm text-transparent bg-clip-text">
                    <span>{project.company}</span>
                    <span>&bull;</span>
                    <span>{project.year}</span>
                  </div>
                  <h3 className="font-serif text-2xl md:text-4xl mt-2 md:mt-5">
                    {project.title}
                  </h3>
                  <hr className="border-t-2 border-white/5 mt-4 md:mt-5" />
                  <ul className="flex flex-col gap-4 mt-4 md:mt-5">
                    {project.results.map((result) => (
                      <li
                        key={result.title}
                        className="flex gap-2 text-sm md:text-base text-white/50"
                      >
                        <CheckCircleIcon className="size-5 md:size-6" />
                        <span>{result.title}</span>
                      </li>
                    ))}
                  </ul>
                  <a href={project.link} target="_blank">
                    <button className="bg-white text-gray-950 h-12 w-full md:w-auto px-6 rounded-xl font-semibold inline-flex items-center justify-center gap-2 mt-8">
                      <span>Visit The Certification</span>
                      <ArraowUpRightIcon className="size-4 " />
                    </button>
                  </a>
                </div>
                <div className="relative">
                  <Image
                    src={project.image}
                    className="mt-8 -mb-4 md:-mb-0 lg:mt-0 lg:absolute lg:h-full lg:w-auto lg:max-w-none"
                    alt={project.title}
                  />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

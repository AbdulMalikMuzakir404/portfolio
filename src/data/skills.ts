import type { StaticImageData } from "next/image";
import html from "@/assets/tech/skill/html.svg";
import css from "@/assets/tech/skill/css.svg";
import javascript from "@/assets/tech/skill/javascript.svg";
import typescript from "@/assets/tech/skill/typescript.svg";
import reactjs from "@/assets/tech/skill/reactjs.svg";
import nextjs from "@/assets/tech/skill/nextjs.svg";
import vue from "@/assets/tech/skill/vue.svg";
import tailwind from "@/assets/tech/skill/tailwind.svg";
import bootstrap from "@/assets/tech/skill/bootstrap.svg";
import jquery from "@/assets/tech/skill/jquery.svg";
import nodejs from "@/assets/tech/skill/nodejs.svg";
import nestjs from "@/assets/tech/skill/nestjs.svg";
import laravel from "@/assets/tech/skill/laravel.svg";
import rails from "@/assets/tech/skill/rail.svg";
import php from "@/assets/tech/skill/php.svg";
import oauth from "@/assets/tech/skill/oauth.svg";
import flutter from "@/assets/tech/skill/flutter.svg";
import dart from "@/assets/tech/skill/dart.svg";
import firebase from "@/assets/tech/skill/firebase.svg";
import psql from "@/assets/tech/skill/psql.svg";
import mysql from "@/assets/tech/skill/mysql.svg";
import redis from "@/assets/tech/skill/redis.svg";
import prisma from "@/assets/tech/skill/prisma.svg";
import docker from "@/assets/tech/skill/docker.svg";
import digitalocean from "@/assets/tech/skill/digitalocean.svg";
import git from "@/assets/tech/skill/git.svg";
import figma from "@/assets/tech/skill/figma.svg";

export type Skill = { name: string; icon?: StaticImageData };

// Grouped from the live site's tech stack and the skills listed in CV2025.pdf.
export const skillGroups: { id: string; title: string; caption: string; items: Skill[] }[] = [
  {
    id: "frontend",
    title: "Frontend",
    caption: "Web interfaces",
    items: [
      { name: "TypeScript", icon: typescript },
      { name: "JavaScript", icon: javascript },
      { name: "React.js", icon: reactjs },
      { name: "Next.js", icon: nextjs },
      { name: "Vue.js", icon: vue },
      { name: "Tailwind CSS", icon: tailwind },
      { name: "HTML", icon: html },
      { name: "CSS", icon: css },
      { name: "Bootstrap", icon: bootstrap },
      { name: "jQuery", icon: jquery },
    ],
  },
  {
    id: "backend",
    title: "Backend",
    caption: "APIs & services",
    items: [
      { name: "NestJS", icon: nestjs },
      { name: "Node.js", icon: nodejs },
      { name: "Laravel", icon: laravel },
      { name: "Ruby on Rails", icon: rails },
      { name: "PHP", icon: php },
      { name: "Python" },
      { name: "REST API" },
      { name: "JWT & OAuth", icon: oauth },
      { name: "Swagger" },
    ],
  },
  {
    id: "distributed",
    title: "Distributed systems",
    caption: "Throughput & scale",
    items: [
      { name: "Kafka (multi-partition)" },
      { name: "Change Data Capture" },
      { name: "Database pooling" },
      { name: "Monorepo" },
    ],
  },
  {
    id: "data",
    title: "Databases",
    caption: "Storage & modeling",
    items: [
      { name: "PostgreSQL", icon: psql },
      { name: "MySQL", icon: mysql },
      { name: "Redis", icon: redis },
      { name: "Prisma", icon: prisma },
      { name: "SQL" },
      { name: "Database Design" },
    ],
  },
  {
    id: "mobile",
    title: "Mobile",
    caption: "Cross-platform apps",
    items: [
      { name: "Flutter", icon: flutter },
      { name: "Dart", icon: dart },
      { name: "Firebase", icon: firebase },
    ],
  },
  {
    id: "infra",
    title: "Cloud & tooling",
    caption: "Ship & maintain",
    items: [
      { name: "Docker", icon: docker },
      { name: "DigitalOcean", icon: digitalocean },
      { name: "Git · GitHub · GitLab · Gitea", icon: git },
      { name: "Postman" },
      { name: "ESLint · Husky" },
      { name: "Figma", icon: figma },
    ],
  },
];

export const practices = ["System Design", "SDLC", "Agile", "Problem Solving", "Team Leadership", "Code Review", "Unit Testing"];

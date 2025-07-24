import fs from 'fs/promises';
import path from 'path';
import { markdownToHtml } from './markdown';

// Environment variables for content paths
const CONTENT_BASE = process.env.CONTENT_PATH || './content';
const DATA_BASE = process.env.DATA_PATH || './data';

/**
 * Read and parse JSON data file
 */
export async function getJsonData(filename: string) {
  const filePath = path.join(process.cwd(), DATA_BASE, filename);
  try {
    const jsonText = await fs.readFile(filePath, 'utf8');
    return JSON.parse(jsonText);
  } catch (error) {
    console.error(`Failed to read JSON file: ${filePath}`, error);
    throw new Error(`Could not load ${filename}`);
  }
}

/**
 * Read markdown file and convert to HTML
 */
export async function getMarkdownContent(filename: string) {
  const filePath = path.join(process.cwd(), CONTENT_BASE, filename);
  try {
    const markdown = await fs.readFile(filePath, 'utf8');
    return await markdownToHtml(markdown);
  } catch (error) {
    console.error(`Failed to read markdown file: ${filePath}`, error);
    throw new Error(`Could not load ${filename}`);
  }
}

/**
 * Get resume data with proper error handling
 */
export async function getResumeData() {
  return await getJsonData('resume.json');
}

/**
 * Get skills data with proper error handling
 */
export async function getSkillsData() {
  return await getJsonData('skills.json');
}

/**
 * Check if content files exist (for development setup validation)
 */
export async function validateContentSetup() {
  const requiredFiles = [
    path.join(CONTENT_BASE, 'about.md'),
    path.join(DATA_BASE, 'resume.json'),
    path.join(DATA_BASE, 'skills.json'),
  ];

  const missing = [];
  for (const file of requiredFiles) {
    const fullPath = path.join(process.cwd(), file);
    try {
      await fs.access(fullPath);
    } catch {
      missing.push(file);
    }
  }

  if (missing.length > 0) {
    console.warn(`Missing content files: ${missing.join(', ')}`);
    console.warn('Please copy .example files and add your content.');
    return false;
  }

  return true;
}
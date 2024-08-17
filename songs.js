import path, { dirname } from "path";
import { fileURLToPath } from "url";
import fs from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));

const heyJudePath = path.resolve(__dirname, './songsDB/hey_jude.json');
const heyJude = JSON.parse(fs.readFileSync(heyJudePath, 'utf-8'));

const veechSheloPath = path.resolve(__dirname, './songsDB/veech_shelo.json');
const veechShelo = JSON.parse(fs.readFileSync(veechSheloPath, 'utf-8'));

const heyJudeLongPath = path.resolve(__dirname, './songsDB/hey_jude_long.json');
const heyJudeLong =  JSON.parse(fs.readFileSync(heyJudeLongPath, 'utf-8'));

export const songDatabase = [
    {
        id: 1,
        title: 'Hey Jude',
        artist: 'The Beatles',
        language: 'English',
        image: '../pictures/heyJudeCover.jpeg',
        lyricsAndChords: heyJude,
        isHebrew: false
    },
    {
        id: 2,
        title: 'ואיך שלא (Veech Shelo)',
        artist: 'אריאל זילבר (Ariel Zilber)',
        language: 'Hebrew',
        image: '../pictures/arielZilbear.png',
        lyricsAndChords: veechShelo,
        isHebrew: true,
    },
    {
        id: 3,
        title: 'Hey Jude (Long)',
        artist: 'The Beatles',
        language: 'English',
        image: '../pictures/heyJudeCover.jpeg',
        lyricsAndChords: heyJudeLong,
        isHebrew: false
    },
];



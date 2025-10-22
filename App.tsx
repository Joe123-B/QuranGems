import React, { useState, useRef, useEffect } from 'react';
import { Header } from './components/Header';
import { VerseCard } from './components/VerseCard';
import { LoadingSpinner } from './components/LoadingSpinner';
import { Footer } from './components/Footer';
import { getPrayerVerses, getRandomVerse } from './services/geminiService';
import type { Verse, Theme } from './types';

const topVerses: Verse[] = [
  {
    reference: 'Surah Al-Fatihah, 1:1-7',
    arabic: 'بِسْمِ اللَّهِ الرَّحْمَـٰنِ الرَّحِيمِ الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ الرَّحْمَـٰنِ الرَّحِيمِ مَالِكِ يَوْمِ الدِّينِ إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ',
    translation: 'In the name of Allah, the Entirely Merciful, the Especially Merciful. [All] praise is [due] to Allah, Lord of the worlds. The Entirely Merciful, the Especially Merciful. Sovereign of the Day of Recompense. It is You we worship and You we ask for help. Guide us to the straight path. The path of those upon whom You have bestowed favor, not of those who have evoked [Your] anger or of those who are astray.',
  },
  {
    reference: 'Surah Al-Baqarah, 2:255 (Ayat al-Kursi)',
    arabic: 'اللَّهُ لَا إِلَـٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَن ذَا الَّذِي يَشْفَعُ عِندَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلَّا بِ مَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ',
    translation: 'Allah - there is no deity except Him, the Ever-Living, the Sustainer of [all] existence. Neither drowsiness overtakes Him nor sleep. To Him belongs whatever is in the heavens and whatever is on the earth. Who is it that can intercede with Him except by His permission? He knows what is [presently] before them and what will be after them, and they encompass not a thing of His knowledge except for what He wills. His Kursi extends over the heavens and the earth, and their preservation tires Him not. And He is the Most High, the Most Great.',
  },
  {
    reference: 'Surah Al-Baqarah, 2:285-286',
    arabic: 'آمَنَ الرَّسُولُ بِمَا أُنزِلَ إِلَيْهِ مِن رَّبِّهِ وَالْمُؤْمِنُونَ ۚ كُلٌّ آمَنَ بِاللَّهِ وَمَلَائِكَتِهِ وَكُتُبِهِ وَرُسُلِهِ لَا نُفَرِّقُ بَيْنَ أَحَدٍ مِّنْ رُّسُلِهِ ۚ وَقَالُوا سَمِعْنَا وَأَطَعْنَا ۖ غُفْرَانَكَ رَبَّنَا وَإِلَيْكَ الْمَصِيرُ. لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا ۚ لَهَا مَا كَسَبَتْ وَعَلَيْهَا مَا اكْتَسَبَتْ ۗ رَبَّنَا لَا تُؤَاخِذْنَا إِن نَّسِينَا أَوْ أَخْطَأْنَا ۚ رَبَّنَا وَلَا تَحْمِلْ عَلَيْنَا إِصْرًا كَمَا حَمَلْتَهُ عَلَى الَّذِينَ مِن قَبْلِنَا ۚ رَبَّنَا وَلَا تُحَمِّلْنَا مَا لَا طَاقَةَ لَنَا بِهِ ۖ وَاعْفُ عَنَّا وَغْفِرْ لَنَا وَارْحَمْنَا ۚ أَنتَ مَوْلَانَا فَانصُرْنَا عَلَى الْقَوْمِ الْكَافِرِينَ',
    translation: 'The Messenger has believed in what was revealed to him from his Lord, and [so have] the believers. All of them have believed in Allah and His angels and His books and His messengers, [saying], "We make no distinction between any of His messengers." And they say, "We hear and we obey. [We seek] Your forgiveness, our Lord, and to You is the [final] destination." Allah does not charge a soul except [with that within] its capacity. It will have [the consequence of] what [good] it has gained, and it will bear [the consequence of] what [evil] it has earned. "Our Lord, do not impose blame upon us if we have forgotten or erred. Our Lord, and lay not upon us a burden like that which You laid upon those before us. Our Lord, and burden us not with that which we have no ability to bear. And pardon us; and forgive us; and have mercy upon us. You are our protector, so give us victory over the disbelieving people."',
  },
  {
    reference: 'Surah Al-Ikhlas, 112:1-4',
    arabic: 'قُلْ هُوَ اللَّهُ أَحَدٌ. اللَّهُ الصَّمَدُ. لَمْ يَلِدْ وَلَمْ يُولَدْ. وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ',
    translation: 'Say, "He is Allah, [who is] One. Allah, the Eternal Refuge. He neither begets nor is born, Nor is there to Him any equivalent."',
  },
  {
    reference: 'Surah Al-Falaq, 113:1-5',
    arabic: 'قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ. مِن شَرِّ مَا خَلَقَ. وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ. وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ. وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ',
    translation: 'Say, "I seek refuge in the Lord of daybreak. From the evil of that which He created. And from the evil of darkness when it settles. And from the evil of the blowers in knots. And from the evil of an envier when he envies."',
  },
  {
    reference: 'Surah An-Nas, 114:1-6',
    arabic: 'قُلْ أَعُوذُ بِرَبِّ النَّاسِ. مَلِكِ النَّاسِ. إِلَٰهِ النَّاسِ. مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ. الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ. مِنَ الْجِنَّةِ وَالنَّاسِ',
    translation: 'Say, "I seek refuge in the Lord of mankind, The Sovereign of mankind, The God of mankind, From the evil of the retreating whisperer - Who whispers in the breasts of mankind - From among the jinn and mankind."',
  },
];

const reciters = [
    { id: 'ar.alafasy', name: 'Mishary Rashid Alafasy' },
    { id: 'ar.abdulsamad', name: 'Abdul Basit Abdus Samad' },
    { id: 'ar.sudais', name: 'Abdur-Rahman as-Sudais' },
    { id: 'ar.minshawi', name: 'Mohamed Siddiq al-Minshawi' },
];

const App: React.FC = () => {
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem('theme') as Theme) || 'light');
  const [query, setQuery] = useState<string>('');
  const [prayerVerses, setPrayerVerses] = useState<Verse[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const [randomVerse, setRandomVerse] = useState<Verse | null>(null);
  const [isRandomVerseLoading, setIsRandomVerseLoading] = useState<boolean>(true);
  const [randomVerseError, setRandomVerseError] = useState<string | null>(null);

  const [featuredVerse, setFeaturedVerse] = useState<Verse | null>(null);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const [selectedReciter, setSelectedReciter] = useState<string>('ar.alafasy');
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark', 'sepia');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const parseVerseReferenceForApi = (reference: string): string | null => {
    const match = reference.match(/(\d+:\d+(-(\d+))?)/);
    return match ? match[0].split('-')[0] : null;
  };

  const handlePlayPause = async (verse: Verse) => {
    if (audioRef.current && currentlyPlaying === verse.reference) {
      audioRef.current.pause();
      setCurrentlyPlaying(null);
      return;
    }

    if (audioRef.current) {
      audioRef.current.pause();
    }

    const parsedRef = parseVerseReferenceForApi(verse.reference);
    if (!parsedRef) {
      setError('Audio for this verse is not available.');
      return;
    }
    
    setCurrentlyPlaying(verse.reference);
    setError(null);

    try {
      const response = await fetch(`https://api.alquran.cloud/v1/ayah/${parsedRef}/${selectedReciter}`);
      if (!response.ok) throw new Error('Failed to fetch audio data from the server.');
      
      const data = await response.json();
      if (data.code !== 200 || !data.data.audio) {
          throw new Error('Audio not found in the API response.');
      }

      const audioUrl = data.data.audio;
      audioRef.current = new Audio(audioUrl);
      
      audioRef.current.play().catch(err => {
        console.error("Audio playback failed:", err);
        setError("Could not play audio.");
        setCurrentlyPlaying(null);
      });

      audioRef.current.onended = () => {
        setCurrentlyPlaying(null);
      };
    } catch (err) {
        console.error("Error fetching or playing audio:", err);
        setError('An error occurred while fetching the audio. Please try another reciter or verse.');
        setCurrentlyPlaying(null);
    }
  };

  const fetchRandomVerse = async () => {
    setIsRandomVerseLoading(true);
    setRandomVerseError(null);
    try {
      const verse = await getRandomVerse();
      setRandomVerse(verse);
    } catch (err) {
      setRandomVerseError('Could not fetch a random verse. Please try again.');
      console.error(err);
    } finally {
      setIsRandomVerseLoading(false);
    }
  };

  useEffect(() => {
    // Select a random featured verse on mount
    const randomIndex = Math.floor(Math.random() * topVerses.length);
    setFeaturedVerse(topVerses[randomIndex]);

    fetchRandomVerse();

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setError(null);
    setPrayerVerses([]);

    try {
      const verses = await getPrayerVerses(query);
      setPrayerVerses(verses);
    } catch (err) {
      setError('An error occurred while fetching verses. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text-main)]">
      <Header currentTheme={theme} setTheme={setTheme} />
      <main className="container mx-auto px-4 py-8 md:py-12">
        
        <section className="mb-10 max-w-md mx-auto">
          <label htmlFor="reciter-select" className="block text-lg font-medium text-[var(--color-text-main)] mb-2 text-center">
            Choose a Reciter
          </label>
          <select
            id="reciter-select"
            value={selectedReciter}
            onChange={(e) => setSelectedReciter(e.target.value)}
            className="w-full px-4 py-3 text-lg border-2 border-[var(--color-input-border)] rounded-lg focus:ring-2 focus:ring-[var(--color-ring)] focus:border-[var(--color-ring)] transition duration-200 bg-[var(--color-input-bg)]"
          >
            {reciters.map((r) => (
              <option key={r.id} value={r.id}>{r.name}</option>
            ))}
          </select>
        </section>

        <section id="top-verses" className="mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-[var(--color-primary-text)] mb-8">Featured Verse</h2>
          <div className="space-y-6 max-w-4xl mx-auto">
            {featuredVerse ? (
              <VerseCard 
                key={featuredVerse.reference} 
                verse={featuredVerse} 
                isPlaying={currentlyPlaying === featuredVerse.reference}
                onPlayPause={handlePlayPause}
              />
            ) : (
              <LoadingSpinner />
            )}
          </div>
        </section>

        <section id="random-verse" className="mb-12 md:mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-primary-text)] mb-2">Discover a Verse</h2>
            <p className="text-lg text-[var(--color-text-muted)]">Let a random passage from the Quran inspire you today.</p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            {isRandomVerseLoading && <LoadingSpinner />}
            {randomVerseError && <p className="text-center text-red-500 text-lg">{randomVerseError}</p>}
            {randomVerse && !isRandomVerseLoading && (
              <VerseCard 
                verse={randomVerse} 
                isPlaying={currentlyPlaying === randomVerse.reference}
                onPlayPause={handlePlayPause}
              />
            )}
          </div>

          <div className="text-center mt-8">
            <button
              onClick={fetchRandomVerse}
              disabled={isRandomVerseLoading}
              className="bg-[var(--color-accent)] text-white font-bold px-8 py-3 rounded-lg hover:bg-[var(--color-accent-hover)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-accent)] transition duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isRandomVerseLoading ? 'Discovering...' : 'Discover Another Verse'}
            </button>
          </div>
        </section>

        <section id="prayer-verses">
          <div className="max-w-3xl mx-auto text-center">
             <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-primary-text)] mb-4">Find Verses for Your Prayers</h2>
            <p className="text-lg text-[var(--color-text-muted)] mb-8">
              Describe a feeling or situation (e.g., seeking patience, showing gratitude, asking for forgiveness) to find impactful verses for your Du'a.
            </p>
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g., 'verses about gratitude'"
                className="w-full px-4 py-3 text-lg border-2 border-[var(--color-input-border)] rounded-lg focus:ring-2 focus:ring-[var(--color-ring)] focus:border-[var(--color-ring)] transition duration-200 bg-[var(--color-input-bg)] placeholder:text-[var(--color-text-muted)]"
                disabled={isLoading}
              />
              <button
                type="submit"
                className="bg-[var(--color-primary)] text-white font-bold px-8 py-3 rounded-lg hover:bg-[var(--color-primary-hover)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary)] transition duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? 'Searching...' : 'Find Verses'}
              </button>
            </form>
          </div>
          
          <div className="mt-12">
            {isLoading && <LoadingSpinner />}
            {error && <p className="text-center text-red-500 text-lg">{error}</p>}
            {prayerVerses.length > 0 && (
              <div className="space-y-6">
                {prayerVerses.map((verse, index) => (
                  <VerseCard 
                    key={index} 
                    verse={verse} 
                    isPlaying={currentlyPlaying === verse.reference}
                    onPlayPause={handlePlayPause}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default App;
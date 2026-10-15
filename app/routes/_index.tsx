import {useCallback, useRef} from 'react';
import type {Route} from './+types/_index';
import {GalleryScene} from '~/components/home/GalleryScene';
import type {HeroIntroHandle} from '~/components/home/HeroLayer';
import {Preloader} from '~/components/home/Preloader';
import {ShowcaseScene} from '~/components/home/ShowcaseScene';
import {StoryScene} from '~/components/home/StoryScene';

export const meta: Route.MetaFunction = () => {
  return [
    {title: 'Hatwater House | Hats made just for you'},
    {
      name: 'description',
      content:
        'Hatwater House crafts every hat to order — shaped to your specifications and finished by hand.',
    },
  ];
};

/** The home page brings its own header and footer (see PageLayout). */
export const handle = {hideLayoutChrome: true};

export default function Homepage() {
  const heroRef = useRef<HeroIntroHandle>(null);

  // The hero entrance is chained to the end of the preloader timeline.
  const handlePreloaderComplete = useCallback(() => {
    heroRef.current?.playIntro();
  }, []);

  return (
    <div className="hw bg-white">
      <Preloader onComplete={handlePreloaderComplete} />
      <ShowcaseScene ref={heroRef} />
      <StoryScene />
      <GalleryScene />
    </div>
  );
}

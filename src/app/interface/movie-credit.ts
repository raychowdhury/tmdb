import { Cast } from './cast';
import { Crew } from './crew';

export interface MovieCredits {
  id: number;  // Movie ID
  cast: Cast[];  // Array of cast members
  crew: Crew[];  // Array of crew members
}

export interface Crew {
  id: number;
  name: string;
  job: string;  // Role in the movie (e.g., director, producer)
  department: string;  // Department (e.g., Directing, Production)
  profile_path: string;  // Path to the crew member's profile image
}

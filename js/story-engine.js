/* ComicForge SA — Story Engine */

// Expand a one-line idea into a full story structure
const StoryEngine = {
  expandStory(oneLine) {
    const lower = oneLine.toLowerCase();
    let title = 'The Red Gem of ';
    if (lower.includes('kzn') || lower.includes('zulu') || lower.includes('kwazulu')) {
      title += 'KwaZulu-Natal';
    } else if (lower.includes('mabopane')) {
      title += 'Mabopane';
    } else if (lower.includes('soweto')) {
      title += 'Soweto';
    } else if (lower.includes('johannesburg')) {
      title += 'Johannesburg';
    } else {
      title += 'the Valley';
    }

    let logline = `A teenage cowherd survives a lion attack and discovers a red gem that unlocks ancestral visions of Mkhululi, awakening Zulu fire-powers that threaten the dark magic users crossing the sea.`;
    if (lower.includes('lion')) {
      logline = `After surviving a lion attack while herding cows, a teenage boy finds a red gem that floods his mind with visions of the past—and awakens powers long forgotten by his clan.`;
    }

    let genre = 'Historic Fantasy / Zulu';
    let theme = 'Ancestral memory and the cost of power';
    let threeActStructure = `Act 1 (Setup): The boy herds cows in rural KZN with his three dogs—a black Rottweiler, a golden retriever with white socks, and an energetic mixed-breed pup. A lion attacks; the dogs save him. He finds a red gem near the kill site.
Act 2 (Confrontation): Touching the gem, visions of Mkhululi flood in. The boy discovers he can spark fire. An isangoma warns him. Tikoloshe sightings increase. A ship appears on the horizon.
Act 3 (Resolution): The boy must master his fire before the dark magic users from across the sea claim the gem and sever the ancestors from the living.`;

    let coldOpen = 'Dawn at the cattle post. The boy counts his herd. A lion roars from the valley. The dogs stand between the boy and the beast.';
    let cliffhanger = 'The gem glows red, and a voice that is not his own whispers: "Mkhululi remembers."';

    return {
      title,
      logline,
      genre,
      theme,
      threeActStructure,
      coldOpen,
      cliffhanger
    };
  }
};
export interface ILogicalFallacy {
    tag: string;
    name: string;
    descr: string;
    rank: number;
    eg: { video?: any; text?: string }[];
}

export const FallacyList: ILogicalFallacy[] = [{
    tag: 'AHF',
    name: '[A]d [H]ominem [F]allacy',
    descr: 'Attacking the person instead of the argument.',
    rank: 0,
    eg: [{
      text: 'Green Peace\'s strategies aren\'t effective because they are all dirty, lazy hippies.'
    }, {
      text: 'How can you argue your case for vegetarianism when you are enjoying that steak?'
    }, {
      text: `(A commentator at retirement of Lance Armstrong) He&apos;s not a great athlete; he&apos;s a
            fraud, a cheat and a liar. That&apos;s why not everybody is "happy for Lance".`
    }]
  }, {
    tag: 'SMF',
    name: '[S]traw [M]an [F]allacy',
    descr: 'Misdirection, attacking a position the opponent doesn’t really hold.',
    rank: 0,
    eg: [
      {
        text: 'People who don\'t support the proposed state minimum wage increase hate the poor.'
      },
      {
        text: `Person A: The children's winter concert at the school should include non-Christmas songs too.
                <br /><br />
              Person B: You won't be happy until Christmas songs are banned from being played on the radio!`},
      {
        text: `Elon Musk: "Self-driving cars are the natural extension of active safety and obviously something we should do."
              <br /><br />
              Opponent: Self-driving cars aren't safe! Did you hear about the self-driving Uber SUV that killed a pedestrian in Arizona?`
      },
      {
        text: `Parent: No dessert until you finish your chicken and vegetables!
              <br /><br />
              Child: You only love me when I eat.`
      }]
  }, {
    tag: 'AIF',
    name: '[A]ppeal to [I]gnorance [F]allacy',
    descr: 'Claiming proof based on the lack thereof.',
    rank: 0,
    eg: [{
      text: `You can't prove that there aren't Martians living in caves
            under the surface of Mars, so it is reasonable for me to believe there are.`},
    {
      text: `If a Democrat is elected, the government will pay for all of my
            utility bills and I will get a new cell phone for free from the government.` },
    {
      text: `If a Republican is elected, we will have women dying from back alley abortions.`
    }]
  }, {
    tag: 'FDF',
    name: '[F]alse [D]ichotomy [F]allacy',
    descr: 'Over simplifying the range of options.',
    rank: 0,
    eg: [{
      text: `You're either part of the solution or part of the problem.
    - No room for innocent bystanders here.`}, {
      text: `If you want better public schools, you have to raise taxes. If you don't want to raise taxes,
       you can't have better schools. - A third alternative is that you could spend the existing tax money more efficiently.`
    }, {
      text: `If you&apos;re not with us, you're against us. - Being neutral is not an option.`
    }]
  }, {
    tag: 'SSF',
    name: '[S]lippery [S]lope [F]allacy',
    descr: 'Use of long causal chains to an unlikely outcome.',
    rank: 0,
    eg: [{
      text: `If we allow the children to choose the movie this time, they are going to expect to be able to
      choose the school they go to or the doctors they visit.`
    }, {
      text: `If you allow the students to redo this test, they are going to
      want to redo every assignment for the rest of the year.`
    }, {
      text: `If we allow gay marriage, the next thing we know, people will want to marry their dogs,
      or their cats, or what about their pigs?`
    }, {
      text: `If we give in every time our baby cries, he will always pitch a fit to get what he wants,
      and he will end up in prison because we never set limits.`
    }]
  }, {
    tag: 'CAF',
    name: '[C]ircular [A]rgument [F]allacy',
    descr: 'Repeating what they already assumed beforehand.',
    rank: 0,
    eg: [{
      text: `I deserve to have a later curfew, so you should let me stay out until 10pm!`
    }, {
      text: `You have to save enough money to pay your bills each month because bills have to be paid.`
    }, {
      video: 'https://www.youtube-nocookie.com/embed/0Cx5KH0BfE4?controls=0&start=2331&end=2337&cc=1'
    }]
  }, {
    tag: 'HGF',
    name: '[H]asty [G]eneralization [F]allacy',
    descr: `General statements with enough evidence.`,
    rank: 0,
    eg: [{
      text: `Four out of five dentists recommend Happy Glossy Smiley
      toothpaste brand.  Therefore, it must be great.`
    }, {
      text: `My father smoked four packs of cigarettes a day since age fourteen and lived until age sixty-nine.
      Therefore, smoking really can’t be that bad for you.`
    }, {
      text: `A driver with a New York license plate cuts you off in traffic. You decide
      that all New York drivers are terrible drivers.`
    }]
  }, {
    tag: 'RHF',
    name: '[R]ed [H]erring [F]allacy',
    descr: `This fallacy consists in diverting attention from the real issue by focusing instead on an issue
    having only a surface relevance to the first.`,
    rank: 0,
    eg: [{
      text: `Son: "Wow, Dad, it's really hard to make a living on my salary." <br />Father: "Consider yourself lucky, son. Why,
      when I was your age, I only made $40 a week."`
    }, {
      text: `Ms. Olive has objected to my views on capital punishment by trying to show that the taking of human life, legally
      or illegally, cannot be ethically justified. But the matter is really simple, isn't it? Murderers certainly aren't ethically
      justified in taking the lives of their victims. Does anyone ever think of the poor victim?`
    }, {
      text: `Reporter: "Mr. President, your opponent, Walter Mondale is considerably younger than you. Do you think that with the
      threat of nuclear war, age should be an issue in this campaign?" President Reagan: "Not at all. I am not going to exploit my
      opponent's youth and inexperience."`
    }]
  }, {
    tag: 'TQF',
    name: '[T]u [Q]uoque [F]allacy',
    descr: `A type of Ad Hominem fallacy pointing out making the argument is not acting consistently with the claims of the argument.`,
    rank: 0,
    eg: []
  }, {
    tag: 'FCF',
    name: '[F]alse [C]ause [F]allacy',
    descr: `a conclusion with insufficient evidence.`,
    rank: 0,
    eg: []
  }, {
    tag: 'PHF',
    name: '[P]ost [H]oc [F]allacy',
    descr: `Mistake something for cause just because it came first.`,
    rank: 0,
    eg: []
  }, {
    tag: 'COF',
    name: '[Co]rrelation [F]allacy',
    descr: `mistakenly interpret two things found together as being causally related.`,
    rank: 0,
    eg: []
  }, {
    tag: 'SCF',
    name: '[S]unk [C]ost [F]allacy',
    descr: `Past expenses that can no longer be recovered, but are often used to justify further investment of time and effort.`,
    rank: 0,
    eg: []
  }, {
    tag: 'AFR',
    name: '[A]rgument [F]rom [R]espect',
    descr: `A misuse of authority.  Citing irrelevant, poor, or false authority figures.`,
    rank: 0,
    eg: []
  }, {
    tag: 'EQF',
    name: '[Eq]uivocation [F]allacy',
    descr: `Words or statements that can mean two different things are a fallacy when used with the intent to deceive.`,
    rank: 0,
    eg: []
  }, {
    tag: 'PIT',
    name: 'Appeal to [Pit]y',
    descr: `When we mistake feelings for facts.`,
    rank: 0,
    eg: []
  }, {
    tag: 'BAF',
    name: '[Ba]ndwagon [F]allacy',
    descr: `When we assume something is true, right, or good, because other people agree with it.`,
    rank: 0,
    eg: []
  }, {
    tag: 'APF',
    name: '[A]ppeal to [P]opularity [F]allacy',
    descr: `Using the popularity of a premise as evidence for its truthfulness.`,
    rank: 0,
    eg: []
  }, {
    tag: 'ACB',
    name: '[A]ppeal to [C]ommon [B]elief',
    descr: `When the claim that most or many people in general or of a particular
    group accept a belief as true is presented as evidence for the claim.`,
    rank: 0,
    eg: []
  }, {
    tag: 'PRO',
    name: '[A]ppeal to [P]robability [F]allacy',
    descr: `A statement that takes something for granted because it would probably be the case (or might be the case).`,
    rank: 0,
    eg: []
  }];

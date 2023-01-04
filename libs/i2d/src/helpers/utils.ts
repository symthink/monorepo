
import { alertController } from '@ionic/core';


export function format(first: string, middle: string, last: string): string {
  return (first || '') + (middle ? ` ${middle}` : '') + (last ? ` ${last}` : '');
}

export function limit(str: string, len: number): string {
  if (str.length > len) {
    return str.substr(0, len) + '...';
  }
  return str;
}

export function touchSupported() {
  return ('ontouchstart' in window);
}

export function canObserveIntersections() {
  return ('IntersectionObserver' in window && 'IntersectionObserverEntry' in window && 'intersectionRatio' in window.IntersectionObserverEntry.prototype);
}

export function stripHtml(html) {
  let tmp = document.createElement("DIV");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
}

export function loadJSON(fileUrl: string): Promise<object> {
  return new Promise((resolve, reject) => {
    const xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', fileUrl, true);
    xobj.onreadystatechange = function () {
      if (xobj.readyState === 4 && xobj.status === 200) {
        try {
          resolve(JSON.parse(xobj.responseText));
        } catch (e) {
          reject(e);
        }
      }
    };
    xobj.send(null);
  });
}

export function loadLocalFileJson(file: Blob): Promise<object> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const jsonResult = JSON.parse(e.target.result.toString());
        resolve(jsonResult);
      } catch (e) {
        reject(e);
      }
    };
    reader.onerror = reject;
    reader.readAsText(file);
  });
}

//t = current time
//b = start value
//c = change in value
//d = duration
function easeInOutQuad(t, b, c, d) {
  t /= d / 2;
  if (t < 1) return c / 2 * t * t + b;
  t--;
  return -c / 2 * (t * (t - 2) - 1) + b;
};

export function scrollTo(element, to, duration) {
  var start = element.scrollTop,
    change = to - start,
    currentTime = 0,
    increment = 20;

  var animateScroll = function () {
    currentTime += increment;
    var val = easeInOutQuad(currentTime, start, change, duration);
    element.scrollTop = val;
    if (currentTime < duration) {
      setTimeout(animateScroll, increment);
    }
  };
  animateScroll();
}

export function chunk(arr: Array<any>, size: number) {
  return Array.from({ length: Math.ceil(arr.length / size) }, (_v, i) =>
    arr.slice(i * size, i * size + size)
  );
}

export async function help(msg: string) {
  const alert = await alertController.create({
    cssClass: 'help-alert',
    message: msg,
    buttons: ['Got it']
  });
  await alert.present();
}

export interface IInfluencer {
  id: string;
  name: string;
  points: number;
  profile: string;
}

export interface IResponse {
  id: string;
  votes?: number;
  posted?: number;
  userId?: string;
  response: string;
}


export interface IQuestion {
  id: string;
  posted?: number;
  userId?: string;
  public?: boolean;
  votes?: number;
  rephrase?: IQuestion[];
  question: string;
  responses?: IResponse[];
}

export interface IArgument {
  id: string;
  claim: string;
  score: number;
}

interface IClaim extends IResponse {
  score?: number;
}

export interface ISymstorm extends IQuestion {
  started?: number;
  activity?: number;
  daysLeft?: number;
  responses: IClaim[];
}

const questions = [
  'Should the value of free speech apply equally to hate speech?',
  "Should hydroponic produce be labeled organic?",
  "Has Big Tech become too big?",
  "What is the best way to put more electric cars on the road?",
  "Should all legal internet content be treated equally by internet service providers?",
  "Is a global tax a good idea?",
  "Should kids be required to wear masks in school?",
  "Should police be held more accountable for excessive use of force?"
]

function applyQuestions(a: any[], mine = 0) {
  for (let x = 0; x < a.length; x++) {
    let o = a[x];
    if(questions[x]) {
      o.question = questions[x];
      o.posted = new Date().getTime();
      o.rephrase = [{
        id: new Date().getTime(),
        votes: 2,
        question: 'Fugiat Lorem qui occaecat ex cillum veniam'
      }];

      if(mine > 0) {
        o.userId = "1";
        mine--;
      }
    } else { break; }
  }
  return a;
}

// https://app.json-generator.com/fqJu1Idd0yI6

// JG.repeat(20, {
//   id: JG.objectId(),
//   userId: JG.integer(0,5) + '',
//   posted: new Date(JG.date()).getTime(),
//   public: JG.bool(),
//   votes: JG.integer(0,-5),
//   question: JG.loremIpsum({ units: 'sentences', count: 1 }).replace(/\.$/,'?'),
//   rephrase: JG.repeat(JG.integer(0,2), {
//     id: JG.objectId(),
//     votes: JG.integer(0, 20),
//   	question: JG.loremIpsum({ units: 'sentences', count: 1, sentenceLowerBound: 3, sentenceUpperBound: 6 }).replace(/\.$/,'?')
//   }),
//   responses: JG.repeat(JG.integer(0,5), {
//   	id: JG.objectId(),
// 	userId: JG.integer(0,5) + '',
//     posted: new Date(JG.date()).getTime(),
//     votes: JG.integer(0, 50),
//   	response: JG.loremIpsum({ units: 'sentences', count: 1 }),
//   })
// });
export function mockQnA(): IQuestion[] {
  const qna = [
    {
      "id": "6120e05d24c13fa40a95dc21",
      "userId": "2",
      "posted": 830162266771,
      "public": false,
      "votes": 5,
      "question": "Qui nostrud incididunt officia amet ex?",
      "rephrase": [
        {
          "id": "6120e05d9f149cad45570456",
          "votes": 16,
          "question": "Culpa voluptate veniam irure?"
        },
        {
          "id": "6120e05d23be763ecea3bb62",
          "votes": 15,
          "question": "Officia eiusmod nulla?"
        }
      ],
      "responses": [
        {
          "id": "6120e05d4d5e55e537b3cc0e",
          "userId": "5",
          "posted": 785798958561,
          "votes": 35,
          "response": "Aliquip est ut cillum aute."
        },
        {
          "id": "6120e05df12085c99a1764e6",
          "userId": "4",
          "posted": 1391241197261,
          "votes": 12,
          "response": "Id eu exercitation in sunt sunt labore ullamco veniam deserunt sit dolor irure excepteur."
        },
        {
          "id": "6120e05d66dd28ebbc226bc0",
          "userId": "3",
          "posted": 269310244321,
          "votes": 32,
          "response": "Exercitation magna velit adipisicing esse cillum ea reprehenderit."
        },
        {
          "id": "6120e05d9e20e0333b46acf7",
          "userId": "5",
          "posted": 357651878801,
          "votes": 7,
          "response": "Ex aliqua mollit cupidatat eu nulla dolore nulla exercitation consequat in dolore officia nisi."
        },
        {
          "id": "6120e05d68492a7102a8d3d9",
          "userId": "3",
          "posted": 1173112876057,
          "votes": 5,
          "response": "Veniam ex elit laborum deserunt tempor minim quis dolore."
        },
        {
          "id": "6120e05d68492a7102da8d3d9",
          "userId": "3",
          "posted": 1173112876057,
          "votes": -2,
          "response": "dfsdasdfa sdfas"
        }
      ]
    },
    {
      "id": "6120e05dfbb95f00cee8ebf2",
      "userId": "5",
      "posted": 1622767852065,
      "public": false,
      "votes": -1,
      "question": "Fugiat Lorem qui occaecat ex cillum veniam laborum officia sunt mollit?",
      "rephrase": [
        {
          "id": "6120e05d42ec09a7e68bd509",
          "votes": 12,
          "question": "Est aliqua ad?"
        }
      ],
      "responses": [
        {
          "id": "6120e05dd8144d773d94107c",
          "userId": "1",
          "posted": 1218970508032,
          "votes": 5,
          "response": "Labore amet Lorem do aliqua minim non nulla ad aliquip veniam voluptate non."
        },
        {
          "id": "6120e05d1cb526b5e4a3e5b5",
          "userId": "4",
          "posted": 1361937166333,
          "votes": 11,
          "response": "Magna minim nulla velit duis officia anim occaecat ad ea proident."
        },
        {
          "id": "6120e05db6d8314cb4f92e47",
          "userId": "1",
          "posted": 962166922835,
          "votes": 9,
          "response": "Dolore deserunt amet Lorem sunt."
        },
        {
          "id": "6120e05d789c98554b1ddd17",
          "userId": "2",
          "posted": 1004752214735,
          "votes": 15,
          "response": "Minim excepteur nostrud id culpa aute magna tempor aute."
        }
      ]
    },
    {
      "id": "6120e05d2d6c686d188fe0dd",
      "userId": "1",
      "posted": 566141373331,
      "public": true,
      "votes": -4,
      "question": "Id commodo enim labore consectetur fugiat ipsum incididunt cillum tempor velit?",
      "rephrase": [
        {
          "id": "6120e05daf049d8a932c1e40",
          "votes": 19,
          "question": "Consectetur pariatur anim?"
        },
        {
          "id": "6120e05d744fac1c362bb733",
          "votes": 6,
          "question": "Aliquip reprehenderit veniam?"
        }
      ],
      "responses": [
        {
          "id": "6120e05de6f48ce1ffc5c634",
          "userId": "1",
          "posted": 1564252090732,
          "votes": 33,
          "response": "Occaecat ex reprehenderit minim reprehenderit aliqua ipsum consequat ex pariatur elit nulla."
        },
        {
          "id": "6120e05ddb3ae0b5462d1b99",
          "userId": "0",
          "posted": 541486134182,
          "votes": 25,
          "response": "Incididunt ipsum enim tempor deserunt."
        }
      ]
    },
    {
      "id": "6120e05d3b74d7526226a80f",
      "userId": "1",
      "posted": 1406210029117,
      "public": true,
      "votes": -2,
      "question": "Nisi deserunt eu aliquip consectetur consequat officia occaecat voluptate consequat?",
      "rephrase": [
        {
          "id": "6120e05d66e100d80bb7b423",
          "votes": 12,
          "question": "Sunt minim proident minim eiusmod?"
        },
        {
          "id": "6120e05d31b85b433dfc439f",
          "votes": 16,
          "question": "In cillum consectetur reprehenderit irure ullamco?"
        }
      ],
      "responses": [
        {
          "id": "6120e05d6ef1a3b3d18ba473",
          "userId": "5",
          "posted": 281778203679,
          "votes": 14,
          "response": "Commodo quis ullamco ex ullamco consequat."
        },
        {
          "id": "6120e05d5281bde684663411",
          "userId": "2",
          "posted": 473769905898,
          "votes": 0,
          "response": "Est officia nostrud veniam anim officia nostrud labore laboris est laborum anim duis fugiat eu."
        },
        {
          "id": "6120e05dc05a944806ce41d8",
          "userId": "2",
          "posted": 410629124337,
          "votes": 41,
          "response": "Aliquip exercitation pariatur ut ad nostrud amet esse proident voluptate nostrud."
        },
        {
          "id": "6120e05dbed0186ba0cac259",
          "userId": "3",
          "posted": 1196622021072,
          "votes": 26,
          "response": "Velit ut incididunt irure exercitation laborum ipsum nulla."
        }
      ]
    },
    {
      "id": "6120e05d3fb8791605c7cefb",
      "userId": "2",
      "posted": 32098375385,
      "public": true,
      "votes": -2,
      "question": "Eu culpa fugiat consequat commodo fugiat ut deserunt exercitation ex?",
      "rephrase": [],
      "responses": [
        {
          "id": "6120e05d8c74f97a4fa24118",
          "userId": "1",
          "posted": 1200232551629,
          "votes": 48,
          "response": "Reprehenderit ut sunt in fugiat excepteur ullamco qui Lorem duis labore nisi."
        }
      ]
    },
    {
      "id": "6120e05da9e9c4ee574a5b64",
      "userId": "1",
      "posted": 272063764542,
      "public": false,
      "votes": -1,
      "question": "Adipisicing Lorem est fugiat mollit qui dolore sunt ad eiusmod consectetur eiusmod sunt dolore?",
      "rephrase": [],
      "responses": [
        {
          "id": "6120e05decc129c2b68d8a2a",
          "userId": "3",
          "posted": 1224810064500,
          "votes": 15,
          "response": "Ad esse elit laborum nulla."
        },
        {
          "id": "6120e05d39c5c787aa210aa9",
          "userId": "5",
          "posted": 286903769613,
          "votes": 39,
          "response": "Culpa aliqua in ut labore ex fugiat nisi ex id officia pariatur sunt labore nostrud."
        }
      ]
    },
    {
      "id": "6120e05dc816471c377b44f6",
      "userId": "4",
      "posted": 1005877715777,
      "public": false,
      "votes": -2,
      "question": "Cupidatat laborum et cupidatat nostrud excepteur ut eiusmod ea ullamco?",
      "rephrase": [
        {
          "id": "6120e05d45b17be0ead54aab",
          "votes": 19,
          "question": "Dolore tempor ex?"
        },
        {
          "id": "6120e05d682c78c8cb8607bf",
          "votes": 11,
          "question": "Consequat mollit irure reprehenderit adipisicing incididunt?"
        }
      ],
      "responses": []
    },
    {
      "id": "6120e05d1c692ccb805e6af2",
      "userId": "3",
      "posted": 12050223191,
      "public": false,
      "votes": -2,
      "question": "Sit nisi irure laboris magna proident excepteur nulla laboris?",
      "rephrase": [],
      "responses": [
        {
          "id": "6120e05d4d5e55e537b3cc0e",
          "userId": "5",
          "posted": 785798958561,
          "votes": 35,
          "response": "Aliquip est ut cillum aute."
        },
        {
          "id": "6120e05df12085c99a1764e6",
          "userId": "4",
          "posted": 1391241197261,
          "votes": 12,
          "response": "Id eu exercitation in sunt sunt labore ullamco veniam deserunt sit dolor irure excepteur."
        },
        {
          "id": "6120e05d66dd28ebbc226bc0",
          "userId": "3",
          "posted": 269310244321,
          "votes": 32,
          "response": "Exercitation magna velit adipisicing esse cillum ea reprehenderit."
        },
        {
          "id": "6120e05d9e20e0333b46acf7",
          "userId": "5",
          "posted": 357651878801,
          "votes": 7,
          "response": "Ex aliqua mollit cupidatat eu nulla dolore nulla exercitation consequat in dolore officia nisi."
        },
        {
          "id": "6120e05d68492a7102a8d3d9",
          "userId": "3",
          "posted": 1173112876057,
          "votes": 5,
          "response": "Veniam ex elit laborum deserunt tempor minim quis dolore."
        }
      ]
    },
    {
      "id": "6120e05d156d745a23a21002",
      "userId": "1",
      "posted": 1550577327248,
      "public": true,
      "votes": -3,
      "question": "Est sit ipsum laboris incididunt aliquip do reprehenderit cupidatat ex excepteur nulla?",
      "rephrase": [],
      "responses": [
        {
          "id": "6120e05d019df0ef1d212515",
          "userId": "0",
          "posted": 112340541409,
          "votes": 29,
          "response": "Commodo duis aute in deserunt ea mollit culpa cupidatat deserunt pariatur sit tempor ea."
        },
        {
          "id": "6120e05deb42c6aae01087eb",
          "userId": "1",
          "posted": 717973564001,
          "votes": 28,
          "response": "Ex ullamco culpa do dolore ad in occaecat cillum et cupidatat proident minim."
        }
      ]
    },
    {
      "id": "6120e05d1a86330d7e1e3e05",
      "userId": "2",
      "posted": 115012112106,
      "public": false,
      "votes": -2,
      "question": "Esse exercitation fugiat officia culpa ut duis pariatur duis et laboris esse ullamco?",
      "rephrase": [
        {
          "id": "6120e05dcf282155e28fcfdf",
          "votes": 7,
          "question": "Ipsum culpa nulla adipisicing dolore?"
        }
      ],
      "responses": [
        {
          "id": "6120e05d49bc2a6f220a2fb2",
          "userId": "0",
          "posted": 1154639332926,
          "votes": 43,
          "response": "Lorem cupidatat pariatur minim ex Lorem."
        }
      ]
    },
    {
      "id": "6120e05dbf55e6e5dfb508ee",
      "userId": "1",
      "posted": 370144389540,
      "public": false,
      "votes": -2,
      "question": "Non aliquip cillum consequat anim reprehenderit fugiat reprehenderit non non ex ex ut velit non?",
      "rephrase": [],
      "responses": [
        {
          "id": "6120e05dedc9014473ef3e7d",
          "userId": "5",
          "posted": 200730648091,
          "votes": 23,
          "response": "Veniam labore id sunt cupidatat sit velit Lorem tempor."
        },
        {
          "id": "6120e05df9baaf5d3695918b",
          "userId": "2",
          "posted": 1469765806353,
          "votes": 34,
          "response": "Occaecat labore dolore pariatur nisi pariatur Lorem Lorem sunt nulla proident est Lorem."
        },
        {
          "id": "6120e05dbd045353ad590428",
          "userId": "5",
          "posted": 877473415843,
          "votes": 32,
          "response": "Ullamco sunt minim tempor quis exercitation."
        },
        {
          "id": "6120e05d18515d7399aeebc0",
          "userId": "5",
          "posted": 442550831479,
          "votes": 12,
          "response": "Ipsum eu occaecat dolore velit laboris est adipisicing elit excepteur cillum occaecat."
        },
        {
          "id": "6120e05d4c00a364d071d0f7",
          "userId": "1",
          "posted": 1261739917240,
          "votes": 36,
          "response": "Dolore culpa nisi officia ut occaecat occaecat officia mollit nostrud tempor laborum fugiat."
        }
      ]
    },
    {
      "id": "6120e05db7e570b917033849",
      "userId": "1",
      "posted": 463956128932,
      "public": false,
      "votes": -3,
      "question": "Nulla veniam nulla amet aute ea fugiat in?",
      "rephrase": [],
      "responses": [
        {
          "id": "6120e05dd5f58a8322e6008b",
          "userId": "0",
          "posted": 1342684776676,
          "votes": 34,
          "response": "Nulla sunt occaecat eu ea ut."
        },
        {
          "id": "6120e05d07ebb14c1ffbd0c3",
          "userId": "5",
          "posted": 1407385044414,
          "votes": 4,
          "response": "Labore culpa dolore elit in fugiat sint nostrud deserunt non."
        },
        {
          "id": "6120e05d8471c5e947f3d551",
          "userId": "1",
          "posted": 1541817902116,
          "votes": 33,
          "response": "Excepteur duis ad Lorem ipsum mollit culpa sint."
        },
        {
          "id": "6120e05d77fd34289129427d",
          "userId": "4",
          "posted": 479314222557,
          "votes": 18,
          "response": "Ullamco deserunt ipsum tempor nisi Lorem labore esse laborum."
        }
      ]
    },
    {
      "id": "6120e05d6800514962ecf3bb",
      "userId": "1",
      "posted": 760836257629,
      "public": false,
      "votes": -4,
      "question": "Ex officia occaecat exercitation adipisicing incididunt ea enim cillum dolore aliquip?",
      "rephrase": [],
      "responses": [
        {
          "id": "6120e05dcf6299298bfd7a17",
          "userId": "0",
          "posted": 485505424267,
          "votes": 24,
          "response": "Cillum mollit adipisicing quis in ad exercitation consequat dolor commodo aliquip ex non."
        },
        {
          "id": "6120e05d0ec1cd9cc768ac33",
          "userId": "5",
          "posted": 848536595512,
          "votes": 38,
          "response": "Do veniam ipsum ut amet ad non laborum aliqua enim officia enim."
        },
        {
          "id": "6120e05d7c1024a293b5b069",
          "userId": "0",
          "posted": 381329732079,
          "votes": 32,
          "response": "Id culpa est duis aliquip est."
        }
      ]
    },
    {
      "id": "6120e05d439116724b922a53",
      "userId": "3",
      "posted": 642994271932,
      "public": true,
      "votes": -1,
      "question": "Id magna ad dolor consectetur anim deserunt ea qui est velit?",
      "rephrase": [
        {
          "id": "6120e05dccb497ca44195ea7",
          "votes": 10,
          "question": "Eu mollit quis minim adipisicing dolor?"
        }
      ],
      "responses": [
        {
          "id": "6120e05d50fc696865c33608",
          "userId": "1",
          "posted": 298959847889,
          "votes": 41,
          "response": "Laborum ea esse nulla nisi labore labore magna ut sit laborum amet laboris."
        },
        {
          "id": "6120e05d7200037c38ec2d3f",
          "userId": "2",
          "posted": 1609086906822,
          "votes": 9,
          "response": "Officia sit est velit reprehenderit do do aute veniam sit qui."
        },
        {
          "id": "6120e05d43decf89004e2721",
          "userId": "5",
          "posted": 494304888695,
          "votes": 26,
          "response": "Consequat est sint labore ipsum aliquip nisi."
        }
      ]
    },
    {
      "id": "6120e05dfa8e4f3815191c48",
      "userId": "0",
      "posted": 771768842205,
      "public": true,
      "votes": -1,
      "question": "Magna incididunt enim enim culpa?",
      "rephrase": [
        {
          "id": "6120e05dbe33384654f8aaa5",
          "votes": 18,
          "question": "Incididunt laboris exercitation nisi culpa?"
        }
      ],
      "responses": [
        {
          "id": "6120e05dc5aaee293bfd13d1",
          "userId": "2",
          "posted": 576911871010,
          "votes": 47,
          "response": "Est aliqua culpa in ad sint fugiat."
        },
        {
          "id": "6120e05d0efb27b312e42699",
          "userId": "1",
          "posted": 569074213005,
          "votes": 46,
          "response": "Nostrud occaecat mollit do veniam incididunt elit eu aute ullamco non incididunt quis."
        },
        {
          "id": "6120e05d4065ec7df7b3c4c2",
          "userId": "1",
          "posted": 936870378856,
          "votes": 30,
          "response": "Cupidatat non mollit commodo aliqua Lorem aliquip culpa voluptate minim consectetur laborum elit voluptate laboris."
        }
      ]
    },
    {
      "id": "6120e05d13fd837e086ae551",
      "userId": "3",
      "posted": 908149007321,
      "public": true,
      "votes": -4,
      "question": "Excepteur enim sunt voluptate sint?",
      "rephrase": [
        {
          "id": "6120e05d5cd8af1078127294",
          "votes": 1,
          "question": "Ea aute non in veniam?"
        },
        {
          "id": "6120e05dd53bd62293dcd682",
          "votes": 17,
          "question": "Dolor ullamco cupidatat?"
        }
      ],
      "responses": [
        {
          "id": "6120e05d5bc6ff1f148972c2",
          "userId": "2",
          "posted": 896742521391,
          "votes": 14,
          "response": "Magna et fugiat deserunt ut pariatur esse do cupidatat non enim dolor cillum."
        },
        {
          "id": "6120e05d5df2feff1b8e97ef",
          "userId": "5",
          "posted": 937731731666,
          "votes": 18,
          "response": "Magna culpa velit ullamco et amet proident."
        },
        {
          "id": "6120e05db76089d322e04aae",
          "userId": "5",
          "posted": 724050929454,
          "votes": 34,
          "response": "Culpa nostrud quis non proident veniam sint ut pariatur dolore ad."
        },
        {
          "id": "6120e05d2ee6ffe97b226f51",
          "userId": "1",
          "posted": 912191131395,
          "votes": 28,
          "response": "Lorem ex eu mollit excepteur ut irure."
        }
      ]
    },
    {
      "id": "6120e05d32fc6689a9e8f507",
      "userId": "0",
      "posted": 1207273650147,
      "public": true,
      "votes": -3,
      "question": "Ipsum consectetur cupidatat mollit adipisicing et aute?",
      "rephrase": [],
      "responses": [
        {
          "id": "6120e05d6a7c1444f3c9ca57",
          "userId": "1",
          "posted": 904604940215,
          "votes": 33,
          "response": "Reprehenderit officia ea sint Lorem eiusmod non fugiat minim sint laborum ad minim commodo."
        },
        {
          "id": "6120e05d8d9864b6ea73ecad",
          "userId": "0",
          "posted": 221613249860,
          "votes": 22,
          "response": "Exercitation ullamco dolor pariatur esse fugiat deserunt."
        },
        {
          "id": "6120e05dd12368fac6408fcd",
          "userId": "4",
          "posted": 63388795971,
          "votes": 0,
          "response": "Et qui eu tempor do tempor exercitation fugiat nulla adipisicing eiusmod mollit."
        },
        {
          "id": "6120e05d2a786c8179fe17f8",
          "userId": "5",
          "posted": 1095679288903,
          "votes": 17,
          "response": "Qui deserunt deserunt reprehenderit excepteur."
        }
      ]
    },
    {
      "id": "6120e05d25122a1ef166a1bc",
      "userId": "1",
      "posted": 468858065561,
      "public": false,
      "votes": -2,
      "question": "Qui cupidatat consectetur nostrud nostrud Lorem sit est excepteur laborum magna?",
      "rephrase": [
        {
          "id": "6120e05dae00339fbdf17a9d",
          "votes": 8,
          "question": "Aliquip quis occaecat duis?"
        }
      ],
      "responses": [
        {
          "id": "6120e05d3a6741494f4aab10",
          "userId": "0",
          "posted": 323875145117,
          "votes": 47,
          "response": "Sit nulla nostrud Lorem ullamco laborum esse ad incididunt elit."
        },
        {
          "id": "6120e05d1789bffcd2f9f6de",
          "userId": "2",
          "posted": 738434357638,
          "votes": 37,
          "response": "Reprehenderit proident eiusmod aliquip excepteur mollit commodo amet."
        },
        {
          "id": "6120e05d14f74e726350fbc2",
          "userId": "2",
          "posted": 1050129261165,
          "votes": 2,
          "response": "Ad eu velit anim exercitation ipsum magna proident qui dolore."
        },
        {
          "id": "6120e05d6d122556db91dd00",
          "userId": "5",
          "posted": 286696151840,
          "votes": 7,
          "response": "Lorem nulla esse adipisicing consectetur id."
        }
      ]
    },
    {
      "id": "6120e05d76ba5259366bea26",
      "userId": "4",
      "posted": 1431603716808,
      "public": true,
      "votes": -4,
      "question": "Exercitation ut cupidatat Lorem minim nisi officia aliquip dolor?",
      "rephrase": [],
      "responses": [
        {
          "id": "6120e05d5534eebb4d6620a2",
          "userId": "2",
          "posted": 144700588278,
          "votes": 26,
          "response": "Minim excepteur sit elit tempor commodo velit aute cillum exercitation aliqua nulla velit dolor consectetur."
        },
        {
          "id": "6120e05db91b9f9d62043be1",
          "userId": "5",
          "posted": 867792035587,
          "votes": 43,
          "response": "Incididunt nulla deserunt cupidatat labore labore id sunt."
        }
      ]
    },
    {
      "id": "6120e05d5c59fe956c96efd7",
      "userId": "4",
      "posted": 118827254941,
      "public": true,
      "votes": -3,
      "question": "Nulla dolore elit laborum anim cillum?",
      "rephrase": [
        {
          "id": "6120e05d7d3cebd5e3fd814a",
          "votes": 15,
          "question": "Ad incididunt anim?"
        }
      ],
      "responses": [
        {
          "id": "6120e05d9de8bf6e10e1c854",
          "userId": "0",
          "posted": 591750974021,
          "votes": 34,
          "response": "Deserunt adipisicing do nulla culpa."
        },
        {
          "id": "6120e05d8d200cda18edc634",
          "userId": "1",
          "posted": 1243017274169,
          "votes": 9,
          "response": "Do proident quis in consequat commodo proident eiusmod cupidatat laboris magna officia laborum."
        },
        {
          "id": "6120e05dbe5426a1197ecacf",
          "userId": "1",
          "posted": 396226460496,
          "votes": 8,
          "response": "Velit ipsum dolore fugiat eu ullamco."
        },
        {
          "id": "6120e05d3c70cf3e553525d7",
          "userId": "1",
          "posted": 293796670806,
          "votes": 33,
          "response": "Adipisicing cillum velit eu pariatur nulla exercitation aliquip."
        }
      ]
    }
  ];
  return applyQuestions(qna, 3);
}

// JG.repeat(100, {
//   id: JG.objectId(),
//   name: `${JG.firstName()} ${JG.lastName()}`,
//   points: JG.integer(0,200),
//   profile: `https://randomuser.me/api/portraits/${JG.bool()?'women':'men'}/${JG.integer(0,100)}.jpg`
// });
export function mockNames(): IInfluencer[] {
  return [
    {
      "id": "61223e18de38827da6df9c9f",
      "name": "Jones Chandler",
      "points": 112,
      "profile": "https://randomuser.me/api/portraits/women/41.jpg"
    },
    {
      "id": "61223e187eba5d1ab759f096",
      "name": "Brown Reilly",
      "points": 28,
      "profile": "https://randomuser.me/api/portraits/men/20.jpg"
    },
    {
      "id": "61223e182871949edfde9f03",
      "name": "Joann Garner",
      "points": 186,
      "profile": "https://randomuser.me/api/portraits/women/61.jpg"
    },
    {
      "id": "61223e18a18f778867e6861a",
      "name": "Clarke Espinoza",
      "points": 3,
      "profile": "https://randomuser.me/api/portraits/women/91.jpg"
    },
    {
      "id": "61223e186e611d60104379db",
      "name": "Anna Lane",
      "points": 126,
      "profile": "https://randomuser.me/api/portraits/women/39.jpg"
    },
    {
      "id": "61223e186c45125e46327410",
      "name": "Nancy Todd",
      "points": 142,
      "profile": "https://randomuser.me/api/portraits/men/56.jpg"
    },
    {
      "id": "61223e18c5edca2f281f7515",
      "name": "Liliana Gamble",
      "points": 93,
      "profile": "https://randomuser.me/api/portraits/men/60.jpg"
    },
    {
      "id": "61223e18b220192b2cdbd10c",
      "name": "Hillary Rocha",
      "points": 199,
      "profile": "https://randomuser.me/api/portraits/women/20.jpg"
    },
    {
      "id": "61223e18a951a622528e4ad5",
      "name": "Lucile Santos",
      "points": 78,
      "profile": "https://randomuser.me/api/portraits/women/37.jpg"
    },
    {
      "id": "61223e183c7f112acafd4091",
      "name": "Foreman Mcmahon",
      "points": 183,
      "profile": "https://randomuser.me/api/portraits/men/87.jpg"
    },
    {
      "id": "61223e187dda1ac19368e00d",
      "name": "Fanny Blackwell",
      "points": 157,
      "profile": "https://randomuser.me/api/portraits/men/25.jpg"
    },
    {
      "id": "61223e18bc5e109116775a5e",
      "name": "Nguyen Ward",
      "points": 22,
      "profile": "https://randomuser.me/api/portraits/men/69.jpg"
    },
    {
      "id": "61223e18e60c70ccaaf90102",
      "name": "Waller Meyer",
      "points": 189,
      "profile": "https://randomuser.me/api/portraits/women/19.jpg"
    },
    {
      "id": "61223e18bd9d27cc2ee2add2",
      "name": "Shaw Zimmerman",
      "points": 133,
      "profile": "https://randomuser.me/api/portraits/men/55.jpg"
    },
    {
      "id": "61223e189208c5d746a8191a",
      "name": "Freeman Nieves",
      "points": 3,
      "profile": "https://randomuser.me/api/portraits/women/37.jpg"
    },
    {
      "id": "61223e182bee35673acfee6e",
      "name": "Patty Mercer",
      "points": 38,
      "profile": "https://randomuser.me/api/portraits/women/37.jpg"
    },
    {
      "id": "61223e18c9af6c7f1ae546b0",
      "name": "Atkinson Townsend",
      "points": 75,
      "profile": "https://randomuser.me/api/portraits/women/39.jpg"
    },
    {
      "id": "61223e18093c82adefe9e251",
      "name": "Courtney Anderson",
      "points": 194,
      "profile": "https://randomuser.me/api/portraits/men/53.jpg"
    },
    {
      "id": "61223e18fbea57c934fa837d",
      "name": "Miles Hurst",
      "points": 1,
      "profile": "https://randomuser.me/api/portraits/women/58.jpg"
    },
    {
      "id": "61223e18251f2f70c40532cb",
      "name": "Lora Alford",
      "points": 190,
      "profile": "https://randomuser.me/api/portraits/women/83.jpg"
    },
    {
      "id": "61223e18bfe0337382ab11a3",
      "name": "Workman Slater",
      "points": 43,
      "profile": "https://randomuser.me/api/portraits/men/27.jpg"
    },
    {
      "id": "61223e186c1c03e26147d72b",
      "name": "Kristin Kelly",
      "points": 131,
      "profile": "https://randomuser.me/api/portraits/women/26.jpg"
    },
    {
      "id": "61223e18546e16fbacc24d01",
      "name": "Daniels Knight",
      "points": 128,
      "profile": "https://randomuser.me/api/portraits/men/71.jpg"
    },
    {
      "id": "61223e180c5e3fadcce7fee8",
      "name": "Guthrie Johns",
      "points": 192,
      "profile": "https://randomuser.me/api/portraits/women/74.jpg"
    },
    {
      "id": "61223e1881a6654744e8775b",
      "name": "Kathie Obrien",
      "points": 103,
      "profile": "https://randomuser.me/api/portraits/men/77.jpg"
    },
    {
      "id": "61223e18a8fb29e233a56a2f",
      "name": "Andrea Bruce",
      "points": 36,
      "profile": "https://randomuser.me/api/portraits/men/72.jpg"
    },
    {
      "id": "61223e18a4a7225bc98ef1d2",
      "name": "Keith Chavez",
      "points": 152,
      "profile": "https://randomuser.me/api/portraits/men/39.jpg"
    },
    {
      "id": "61223e187c39b97414a11d2a",
      "name": "Liz Santiago",
      "points": 91,
      "profile": "https://randomuser.me/api/portraits/women/65.jpg"
    },
    {
      "id": "61223e187a40c420025f64a0",
      "name": "Barnes Martinez",
      "points": 199,
      "profile": "https://randomuser.me/api/portraits/women/51.jpg"
    },
    {
      "id": "61223e18b348a2f0b771da9c",
      "name": "Phyllis Gallegos",
      "points": 146,
      "profile": "https://randomuser.me/api/portraits/men/99.jpg"
    },
    {
      "id": "61223e18a95cb236c2194117",
      "name": "Beryl Vinson",
      "points": 140,
      "profile": "https://randomuser.me/api/portraits/men/38.jpg"
    },
    {
      "id": "61223e187fcc2685917671e8",
      "name": "Darcy Chang",
      "points": 135,
      "profile": "https://randomuser.me/api/portraits/men/71.jpg"
    },
    {
      "id": "61223e182bc71bfc25be6256",
      "name": "Hendrix Barlow",
      "points": 166,
      "profile": "https://randomuser.me/api/portraits/women/72.jpg"
    },
    {
      "id": "61223e18aace5441f9160df0",
      "name": "Elba Irwin",
      "points": 20,
      "profile": "https://randomuser.me/api/portraits/women/78.jpg"
    },
    {
      "id": "61223e18428f876b513f7c03",
      "name": "Armstrong Logan",
      "points": 3,
      "profile": "https://randomuser.me/api/portraits/women/13.jpg"
    },
    {
      "id": "61223e180d910177b32d2361",
      "name": "Dalton Wagner",
      "points": 181,
      "profile": "https://randomuser.me/api/portraits/women/9.jpg"
    },
    {
      "id": "61223e1831a938501feee696",
      "name": "Estela Peck",
      "points": 64,
      "profile": "https://randomuser.me/api/portraits/men/99.jpg"
    },
    {
      "id": "61223e185c890305b7f78d44",
      "name": "Dominguez Phillips",
      "points": 163,
      "profile": "https://randomuser.me/api/portraits/men/90.jpg"
    },
    {
      "id": "61223e18d219c1f627946ba1",
      "name": "Newman Boyer",
      "points": 39,
      "profile": "https://randomuser.me/api/portraits/women/22.jpg"
    },
    {
      "id": "61223e182e62b5bcba9324cb",
      "name": "Hurst Mcneil",
      "points": 2,
      "profile": "https://randomuser.me/api/portraits/women/1.jpg"
    },
    {
      "id": "61223e1811fe082fbbefb378",
      "name": "Latonya Bryan",
      "points": 98,
      "profile": "https://randomuser.me/api/portraits/men/66.jpg"
    },
    {
      "id": "61223e18965a5d6a77acd571",
      "name": "King Sears",
      "points": 119,
      "profile": "https://randomuser.me/api/portraits/women/84.jpg"
    },
    {
      "id": "61223e18097c3e8e4ef5e14e",
      "name": "Neva Gates",
      "points": 167,
      "profile": "https://randomuser.me/api/portraits/women/19.jpg"
    },
    {
      "id": "61223e183789bb5e7235b473",
      "name": "Mcdowell Fletcher",
      "points": 121,
      "profile": "https://randomuser.me/api/portraits/women/46.jpg"
    },
    {
      "id": "61223e1870cee56745df12ba",
      "name": "Farrell Osborne",
      "points": 23,
      "profile": "https://randomuser.me/api/portraits/men/22.jpg"
    },
    {
      "id": "61223e181dcef5866cd74834",
      "name": "Avery Walls",
      "points": 53,
      "profile": "https://randomuser.me/api/portraits/women/3.jpg"
    },
    {
      "id": "61223e1832fc85d3ed03decf",
      "name": "Petersen Holder",
      "points": 101,
      "profile": "https://randomuser.me/api/portraits/women/41.jpg"
    },
    {
      "id": "61223e18dabbe329a4403a42",
      "name": "Merle Fleming",
      "points": 115,
      "profile": "https://randomuser.me/api/portraits/men/69.jpg"
    },
    {
      "id": "61223e185dbe924487fb2b72",
      "name": "Bruce Mcconnell",
      "points": 10,
      "profile": "https://randomuser.me/api/portraits/men/18.jpg"
    },
    {
      "id": "61223e1829646a1b3b4a6576",
      "name": "Moss Ray",
      "points": 185,
      "profile": "https://randomuser.me/api/portraits/women/20.jpg"
    },
    {
      "id": "61223e18ab03f8101032f8a4",
      "name": "Odessa Sharpe",
      "points": 99,
      "profile": "https://randomuser.me/api/portraits/women/11.jpg"
    },
    {
      "id": "61223e18db4a97c7396983b2",
      "name": "Janie Cherry",
      "points": 61,
      "profile": "https://randomuser.me/api/portraits/women/25.jpg"
    },
    {
      "id": "61223e181c5268236a697d1e",
      "name": "Newton Smith",
      "points": 69,
      "profile": "https://randomuser.me/api/portraits/men/33.jpg"
    },
    {
      "id": "61223e18a475c3a424da3a39",
      "name": "Alba Dorsey",
      "points": 167,
      "profile": "https://randomuser.me/api/portraits/women/76.jpg"
    },
    {
      "id": "61223e18a2f89a80c7fdb4a0",
      "name": "Rosella Nunez",
      "points": 29,
      "profile": "https://randomuser.me/api/portraits/men/28.jpg"
    },
    {
      "id": "61223e187b99b12152246ccb",
      "name": "Madge Brock",
      "points": 125,
      "profile": "https://randomuser.me/api/portraits/women/48.jpg"
    },
    {
      "id": "61223e1879a106014a986670",
      "name": "Serrano Calderon",
      "points": 197,
      "profile": "https://randomuser.me/api/portraits/women/64.jpg"
    },
    {
      "id": "61223e189f9d7ab95f9a5c9d",
      "name": "Christensen Rose",
      "points": 56,
      "profile": "https://randomuser.me/api/portraits/women/99.jpg"
    },
    {
      "id": "61223e18e09fe1deef7f6477",
      "name": "Loraine Coffey",
      "points": 200,
      "profile": "https://randomuser.me/api/portraits/men/16.jpg"
    },
    {
      "id": "61223e183a1bf2a9a631f4f3",
      "name": "Alissa Rosales",
      "points": 17,
      "profile": "https://randomuser.me/api/portraits/women/5.jpg"
    },
    {
      "id": "61223e185f2e28ef4e01d265",
      "name": "Lara Turner",
      "points": 161,
      "profile": "https://randomuser.me/api/portraits/men/79.jpg"
    },
    {
      "id": "61223e188e46e97a191fb03e",
      "name": "Gilbert Dennis",
      "points": 130,
      "profile": "https://randomuser.me/api/portraits/men/71.jpg"
    },
    {
      "id": "61223e180112aa2d7367eb45",
      "name": "Decker Baker",
      "points": 146,
      "profile": "https://randomuser.me/api/portraits/women/1.jpg"
    },
    {
      "id": "61223e18dbf73fe127ba0ad3",
      "name": "Roslyn Carter",
      "points": 73,
      "profile": "https://randomuser.me/api/portraits/men/58.jpg"
    },
    {
      "id": "61223e18a37fb651b028c62c",
      "name": "Stephens Riley",
      "points": 184,
      "profile": "https://randomuser.me/api/portraits/men/81.jpg"
    },
    {
      "id": "61223e187eb43f6293674ac0",
      "name": "Soto Reynolds",
      "points": 72,
      "profile": "https://randomuser.me/api/portraits/men/92.jpg"
    },
    {
      "id": "61223e18f4e779c8fa9095d8",
      "name": "Muriel Cabrera",
      "points": 185,
      "profile": "https://randomuser.me/api/portraits/men/13.jpg"
    },
    {
      "id": "61223e185a0f0a6b6e352f05",
      "name": "Erma Palmer",
      "points": 71,
      "profile": "https://randomuser.me/api/portraits/men/16.jpg"
    },
    {
      "id": "61223e189d8edf706dbb88f5",
      "name": "Yates Austin",
      "points": 144,
      "profile": "https://randomuser.me/api/portraits/women/1.jpg"
    },
    {
      "id": "61223e18e449a593f9566638",
      "name": "Eloise Michael",
      "points": 142,
      "profile": "https://randomuser.me/api/portraits/women/17.jpg"
    },
    {
      "id": "61223e182208ed23bf95d279",
      "name": "Rhodes Hudson",
      "points": 41,
      "profile": "https://randomuser.me/api/portraits/women/33.jpg"
    },
    {
      "id": "61223e180b007d830e153b38",
      "name": "Claudia Salazar",
      "points": 138,
      "profile": "https://randomuser.me/api/portraits/men/95.jpg"
    },
    {
      "id": "61223e1861d498c3034b52d6",
      "name": "Angelia Hatfield",
      "points": 174,
      "profile": "https://randomuser.me/api/portraits/women/61.jpg"
    },
    {
      "id": "61223e18b843830b289d5d15",
      "name": "Roy Walsh",
      "points": 65,
      "profile": "https://randomuser.me/api/portraits/women/20.jpg"
    },
    {
      "id": "61223e18cca70649be940336",
      "name": "Emerson Schroeder",
      "points": 27,
      "profile": "https://randomuser.me/api/portraits/men/47.jpg"
    },
    {
      "id": "61223e183e85bfadcdef05c3",
      "name": "Melva Jordan",
      "points": 88,
      "profile": "https://randomuser.me/api/portraits/women/96.jpg"
    },
    {
      "id": "61223e18ccf93baaba8d94ee",
      "name": "Frank Graham",
      "points": 60,
      "profile": "https://randomuser.me/api/portraits/women/80.jpg"
    },
    {
      "id": "61223e1861261ec00b3ddabb",
      "name": "Mona Hahn",
      "points": 157,
      "profile": "https://randomuser.me/api/portraits/men/41.jpg"
    },
    {
      "id": "61223e18abbfa7f87ccea562",
      "name": "Higgins Rosario",
      "points": 190,
      "profile": "https://randomuser.me/api/portraits/men/48.jpg"
    },
    {
      "id": "61223e18452b621d09d10011",
      "name": "Julie Lindsay",
      "points": 50,
      "profile": "https://randomuser.me/api/portraits/men/82.jpg"
    },
    {
      "id": "61223e1876be77c735ff9140",
      "name": "Sloan Gilbert",
      "points": 138,
      "profile": "https://randomuser.me/api/portraits/men/24.jpg"
    },
    {
      "id": "61223e1849fe982d84b59dad",
      "name": "Mindy Watts",
      "points": 76,
      "profile": "https://randomuser.me/api/portraits/women/15.jpg"
    },
    {
      "id": "61223e1877940b83e6133ad6",
      "name": "Latasha Gilmore",
      "points": 199,
      "profile": "https://randomuser.me/api/portraits/men/72.jpg"
    },
    {
      "id": "61223e18e9bbc0355951b989",
      "name": "Corrine Hardin",
      "points": 66,
      "profile": "https://randomuser.me/api/portraits/women/45.jpg"
    },
    {
      "id": "61223e1848bd3acb81a5ca33",
      "name": "Alyce Summers",
      "points": 172,
      "profile": "https://randomuser.me/api/portraits/men/57.jpg"
    },
    {
      "id": "61223e18a24190f880222493",
      "name": "Kelley Henderson",
      "points": 40,
      "profile": "https://randomuser.me/api/portraits/men/33.jpg"
    },
    {
      "id": "61223e1811c639c90fc8a6a9",
      "name": "Roth Newton",
      "points": 151,
      "profile": "https://randomuser.me/api/portraits/women/96.jpg"
    },
    {
      "id": "61223e18db7a25135c0021b7",
      "name": "Stein Lara",
      "points": 89,
      "profile": "https://randomuser.me/api/portraits/men/25.jpg"
    },
    {
      "id": "61223e1893c7f8733521ae88",
      "name": "Jenkins Griffin",
      "points": 63,
      "profile": "https://randomuser.me/api/portraits/women/2.jpg"
    },
    {
      "id": "61223e1852eebfa61104f0e8",
      "name": "Kent Lawson",
      "points": 26,
      "profile": "https://randomuser.me/api/portraits/women/23.jpg"
    },
    {
      "id": "61223e186421cae2755f9909",
      "name": "Ruiz Holland",
      "points": 10,
      "profile": "https://randomuser.me/api/portraits/women/97.jpg"
    },
    {
      "id": "61223e18892087fc4a0856a1",
      "name": "Mayo Valentine",
      "points": 156,
      "profile": "https://randomuser.me/api/portraits/men/25.jpg"
    },
    {
      "id": "61223e186bf631f25d4446d2",
      "name": "Summer Pace",
      "points": 176,
      "profile": "https://randomuser.me/api/portraits/men/36.jpg"
    },
    {
      "id": "61223e18425faf11bcfb8ac0",
      "name": "Maryellen Stafford",
      "points": 72,
      "profile": "https://randomuser.me/api/portraits/men/88.jpg"
    },
    {
      "id": "61223e183ea934d0689dc672",
      "name": "Carey Mcknight",
      "points": 94,
      "profile": "https://randomuser.me/api/portraits/men/35.jpg"
    },
    {
      "id": "61223e180e6fd2a1c1caa652",
      "name": "Vilma Owens",
      "points": 2,
      "profile": "https://randomuser.me/api/portraits/women/36.jpg"
    },
    {
      "id": "61223e18732a8f3d961c7e79",
      "name": "Mcneil Beasley",
      "points": 97,
      "profile": "https://randomuser.me/api/portraits/men/40.jpg"
    },
    {
      "id": "61223e18fbdbdebbcc1cc328",
      "name": "Valeria Mcgee",
      "points": 143,
      "profile": "https://randomuser.me/api/portraits/women/56.jpg"
    },
    {
      "id": "61223e18ac46868e9ea36d50",
      "name": "Ashley Merritt",
      "points": 18,
      "profile": "https://randomuser.me/api/portraits/women/65.jpg"
    },
    {
      "id": "61223e18546c7d69968a4881",
      "name": "Luann Brewer",
      "points": 55,
      "profile": "https://randomuser.me/api/portraits/women/30.jpg"
    }
  ];
}

// JG.repeat(10, {
//   id: JG.objectId(),
//   posted: new Date(JG.date()).getTime(),
//   symstormStart: new Date(JG.date()).getTime(),
//   daysLeft: JG.integer(1,30),
//   question: JG.loremIpsum({ units: 'sentences', count: 1 }).replace(/\.$/,'?'),
//   activity: JG.integer(0,10),
//   responses: JG.repeat(2, {
//   	id: JG.objectId(),
//     posted: new Date(JG.date()).getTime(),
//     score: JG.integer(0,100),
//   	response: JG.loremIpsum({ units: 'sentences', count: 1 }),
//   })
// });
export function mockSymstorms(): ISymstorm[] {
  const storms = [
    {
      "id": "61165c0490d878bf9ce68572",
      "posted": 757450815522,
      "activity": 10,
      "daysLeft": 11,
      "question": "Exercitation aliqua sit est dolor cillum laboris?",
      "responses": [
        {
          "id": "61165c049c822a0b7e080748",
          "score": 9,
          "posted": 751600252755,
          "response": "Amet ad esse voluptate sunt aute sit."
        },
        {
          "id": "61165c04c784b13ee3235c04",
          "score": 75,
          "posted": 108816817029,
          "response": "Incididunt veniam eiusmod culpa nisi."
        }
      ],
      "symstormStart": 1455934480999
    },
    {
      "id": "61165c04804e7e0cab650ba6",
      "posted": 322535528033,
      "activity": 10,
      "daysLeft": 5,
      "question": "Aliquip laboris est exercitation reprehenderit cillum aute officia quis?",
      "responses": [
        {
          "id": "61165c042788975010da6e9c",
          "score": 54,
          "posted": 1596596635665,
          "response": "Aute excepteur nostrud est eu culpa sint aute et mollit tempor voluptate."
        },
        {
          "id": "61165c04bd885fec8ca1f8aa",
          "score": 90,
          "posted": 1407892500485,
          "response": "Excepteur nostrud consequat commodo dolor elit ad consequat nulla nulla voluptate laborum minim laboris adipisicing."
        }
      ],
      "symstormStart": 1036101407207
    },
    {
      "id": "61165c04508d0a4503f797f0",
      "posted": 450881144560,
      "activity": 8,
      "daysLeft": 17,
      "question": "Velit sunt sunt ex aliquip exercitation ex magna voluptate reprehenderit pariatur nostrud adipisicing sunt?",
      "responses": [
        {
          "id": "61165c043062229ed8d83811",
          "score": 4,
          "posted": 1474671562778,
          "response": "Labore aute Lorem fugiat ex adipisicing aute officia."
        },
        {
          "id": "61165c04c87ef460dc943836",
          "score": 1,
          "posted": 1298768911764,
          "response": "Nulla minim occaecat velit officia sint aliqua duis sit sint mollit magna."
        }
      ],
      "symstormStart": 560863688490
    },
    {
      "id": "61165c04052bf5bc71e57bd0",
      "posted": 365151905276,
      "activity": 5,
      "daysLeft": 13,
      "question": "Nulla mollit velit occaecat eu et cupidatat cillum nostrud?",
      "responses": [
        {
          "id": "61165c04d1f16de8aa169b5c",
          "score": 77,
          "posted": 180785909268,
          "response": "Veniam mollit proident consectetur mollit et laboris labore consequat ipsum aliquip est."
        },
        {
          "id": "61165c0483e10b6a03cd9e23",
          "score": 98,
          "posted": 423999584971,
          "response": "Ut magna qui amet id reprehenderit proident."
        }
      ],
      "symstormStart": 570271415974
    },
    {
      "id": "61165c046028d36c40141479",
      "posted": 1447266680134,
      "activity": 0,
      "daysLeft": 2,
      "question": "Culpa dolore mollit dolore ut commodo cupidatat?",
      "responses": [
        {
          "id": "61165c04d769f2985bccc518",
          "score": 83,
          "posted": 827351318545,
          "response": "Aliqua labore pariatur qui anim in qui esse quis do aliquip."
        },
        {
          "id": "61165c049004235e73bbc9fa",
          "score": 24,
          "posted": 37250783143,
          "response": "In laboris cillum eiusmod proident dolor ex ullamco ex excepteur aliquip occaecat elit amet."
        }
      ],
      "symstormStart": 1046085509311
    },
    {
      "id": "61165c0453de00699aacbb5e",
      "posted": 437377660184,
      "activity": 4,
      "daysLeft": 29,
      "question": "Sit ea sit officia incididunt aute aliqua incididunt duis ea ex minim ipsum veniam?",
      "responses": [
        {
          "id": "61165c04f62247e6d59fe019",
          "score": 33,
          "posted": 569333218831,
          "response": "Ipsum in consequat anim in id tempor velit sint consectetur enim laborum sunt."
        },
        {
          "id": "61165c0441f07f725daf0bd9",
          "score": 87,
          "posted": 1260607794513,
          "response": "Duis velit aliquip cupidatat ipsum labore dolor ex irure proident fugiat duis et labore voluptate."
        }
      ],
      "symstormStart": 1021170723905
    },
    {
      "id": "61165c041fbadfd234b7db51",
      "posted": 608898448580,
      "activity": 1,
      "daysLeft": 19,
      "question": "Dolore sit in sunt consequat esse incididunt?",
      "responses": [
        {
          "id": "61165c045ad067f66d205ad1",
          "score": 22,
          "posted": 114375133149,
          "response": "Et sit minim fugiat aliquip enim nostrud qui deserunt dolore officia duis."
        },
        {
          "id": "61165c040653ad6372032efb",
          "score": 9,
          "posted": 1214396037378,
          "response": "Enim excepteur anim consequat aute in in."
        }
      ],
      "symstormStart": 1514660128388
    },
    {
      "id": "61165c04c9f57a9a196f28f8",
      "posted": 416262408989,
      "activity": 6,
      "daysLeft": 27,
      "question": "Laborum laborum aliqua ad voluptate excepteur velit ipsum in labore excepteur sit do in exercitation?",
      "responses": [
        {
          "id": "61165c0471c6aa036088d4c9",
          "score": 62,
          "posted": 402587700775,
          "response": "Enim tempor labore ex ex cupidatat."
        },
        {
          "id": "61165c049efdbfc2a8719715",
          "score": 84,
          "posted": 1224403315140,
          "response": "Ex veniam qui anim adipisicing id ex excepteur id."
        }
      ],
      "symstormStart": 123309774146
    },
    {
      "id": "61165c04d2c0ee81749b5528",
      "posted": 502996704579,
      "activity": 2,
      "daysLeft": 8,
      "question": "Deserunt cupidatat eiusmod et proident adipisicing adipisicing?",
      "responses": [
        {
          "id": "61165c04d4de78abaab06b25",
          "score": 25,
          "posted": 383820497244,
          "response": "Do dolor dolor veniam magna consequat cupidatat tempor enim."
        },
        {
          "id": "61165c04df7d0375d61a1afc",
          "score": 7,
          "posted": 665944981590,
          "response": "Ad ipsum excepteur eu cupidatat pariatur ad excepteur magna."
        }
      ],
      "symstormStart": 209432794738
    },
    {
      "id": "61165c0425d4dc981003760b",
      "posted": 1419856616090,
      "activity": 8,
      "daysLeft": 28,
      "question": "Consequat duis duis in sunt laboris deserunt minim elit incididunt excepteur eiusmod voluptate anim commodo?",
      "responses": [
        {
          "id": "61165c046b9f1e9f753731c4",
          "score": 16,
          "posted": 1283907514722,
          "response": "In enim ut sunt laborum esse anim sint voluptate excepteur et id ullamco do."
        },
        {
          "id": "61165c0429563ada4254eb81",
          "score": 54,
          "posted": 118967819356,
          "response": "Sint amet veniam ex excepteur."
        }
      ],
      "symstormStart": 376666488704
    }
  ];
  return applyQuestions(storms);
}

export interface IUser {
  id: string;
  name: string;
}

export function mockLogin(): IUser {
  return {
    id: "1",
    name: "Semper Crawely"
  }
}
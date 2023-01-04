import { BehaviorSubject, Observable, Subject, Subscriber } from 'rxjs';
// import { distinctUntilChanged, map } from 'rxjs/operators';
import * as SymArgSample from '../assets-i2d/sample.sym.json';
import * as SymArgSample2 from '../assets-i2d/iplorem.sym.json';
import { mockNames, mockQnA, mockSymstorms, mockLogin,
   ISymstorm, IQuestion, IInfluencer, IUser, IArgument } from '../helpers/utils';

// import { } from '@ionic/storage';
import dayjs from 'dayjs';



interface IAppState {
  appName: string
}

const initialState = {
  appName: 'SymThink'
}

//storage local, personal cloud, symthink cloud
// local: for offline/semi-connected work
// personal cloud: for cross-device syncing; prevent data loss 
// symthink cloud: sharing data with others; public data

class AppStateService {

  //in database later
  questions: IQuestion[];

  myQuestions: IQuestion[];
  recentQuestions: IQuestion[];
  symStorms: ISymstorm[];
  influencers: IInfluencer[];
  arguments: IArgument[];
  user: IUser;
  questionSetObs: Observable<void>;
  private questionSetOb$: Subscriber<void>;

  private state$: BehaviorSubject<IAppState>;
  // somevar$ = this.select(v => v.appName);

  private get state(): IAppState {
      return this.state$.getValue();
  }

  constructor() {
      this.questionSetObs = new Observable(subcriber => {
        this.questionSetOb$ = subcriber;
      });
      this.questionSetObs.subscribe()
      this.state$ = new BehaviorSubject<IAppState>(initialState);
      this.user = mockLogin();
      this.questions = mockQnA();
      this.arguments = mockSymstorms().map(o => {
        if (o.responses.length) {
          const arg = o.responses[0];
          return {
            id: o.id,
            claim: arg.response,
            score: arg.score
          }  
        }
      });
      this.arguments.push(...this.arguments);
      console.log(this.arguments);
      this.symStorms = mockSymstorms();
      this.influencers = mockNames().sort((a,b) => a.points < b.points ? 1 : -1);
      this.updateQuestionSets(); 
      // this.setState({asdf: 'asdf'});
  }

  updateQuestionSets() {
    this.myQuestions = this.questions.filter(o => o.userId === this.user.id);
    this.myQuestions.sort((a, b) => a.posted < b.posted ? 1 : -1);
    this.recentQuestions = this.questions.filter(() => true);
    // this.recentQuestions = this.questions.filter(o => {
    //   const daysOld = -(dayjs(o.posted).diff(dayjs(), 'd'));
    //   return o.public && daysOld < 10;
    // });
    //this.recentQuestions.sort(() => Math.random() - 0.5);
    this.questionSetOb$.next();
  }

  addQuestionFromText(ques: string) {
    const newQuestion: IQuestion = {
      id: '' + new Date().getTime(),
      posted: new Date().getTime(),
      userId: this.user.id,
      votes: 0,
      question: ques,
      public: false,
      rephrase: [],
      responses: []
    }
    this.questions.push(newQuestion);
    this.updateQuestionSets();
  }

  findQuestion(id: string) {
    return this.questions.find(o => o.id === id);
  }

  findInfluencer(id: string) {
    return this.influencers.find(o => o.id === id);
  }

  sortMyQuestionsByDate() {
    this.myQuestions.sort((a, b) => a.posted < b.posted ? 1 : -1)
  }

  get sampleArg() {
    return SymArgSample;
  }

  get sampleArg2() {
    return SymArgSample2;
  }
  // private select<K>(mapFn: (state: IAppState) => K): Observable<K> {
  //     return this.state$.asObservable().pipe(
  //         map((state: IAppState) => mapFn(state)),
  //         distinctUntilChanged()
  //     );
  // }

  private setState(newState: Partial<any>) {
      console.log('setState: ', newState);
      this.state$.next({
          ...this.state,
          ...newState,
      });
  }

}

export const AppState = new AppStateService();
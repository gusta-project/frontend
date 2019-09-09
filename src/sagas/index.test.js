import { fork, all } from 'redux-saga/effects';

import saga from './index';
import toast from './toast';
import application from './application';

describe('index saga', () => {
  it('forks all sagas', () => {
    const gen = saga();
    const result = gen.next();

    expect(result.value).toEqual(all([application, toast].map(fork)));
  });
});

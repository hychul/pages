![git-version](https://img.shields.io/badge/Git-2.28.0-red.svg?style=flat-square)  

현재 회사에서 개발하는 프로젝트는 MSC 로 구성되어 동작하고 있지만, 공통으로 사용하는 부분을 submodule로 만들어 공유하여 사용한다.

서브모듈은 아무래도 각각의 브랜치에서 따로 업데이트 되어 사용될 수 있기 때문에, 다른 브랜치에서 먼저 업데이트 된 후 다른 브랜치에서 이를 업데이트 하여 베이스 브랜치에 PR을 실행하려고 하면 conflict가 나게 된다.

이럴 땐 서브모듈을 베이스 브랜치의 것으로 reset하면 간단하게 해결 할 수 있다.

```terminal
$ git reset [base branch name] [path/to/submodule]
```
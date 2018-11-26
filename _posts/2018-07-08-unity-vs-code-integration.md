---
title: Unity VSCode 연동
date: 2018-07-08
categories:
- Game
tags:
- Development
- Game
- Unity
- VSCode
---

![unity-vs-code-integration](https://user-images.githubusercontent.com/18159012/42456572-396bab94-83d0-11e8-8a35-b42c4968c50b.png)

 유니티를 통해 게임을 개발하기 위해선 C#을 지원하는 IDE를 선택해야한다. 현재 2018.1 버전 기준 유니티에서 Visual Studio의 사용을 권장하고 있다. Visual Studio가 유니티 디버깅에 대한 강력한 기능들을 제공해주지만 프로그램이 너무 무겁게 느껴진다.

개인적으로 Jetbrain 사의 Rider를 좋아하는데, IntelliJ와 같은 커뮤니티 버전이 없어 사용하기 위해선 돈을 내고 구독을 해야한다. 띄엄띄엄 취미로 하는 게임 개발을 정기적인 구독을 하면서 하기엔 부담이 되어 가벼운 무료 IDE를 찾다가 MS의 VS Code를 알게 되었다.

가벼울 뿐만 아니라 유니티가 공식으로 지원하는 IDE이기 때문에 간단한 설치를 통해 유니티와의 연동이 가능하다.

# VS Code 설치

https://code.visualstudio.com/

위의 링크를 통해 VS Code를 설치할 수 있다.

# VS Code를 유니티 스크립트 에디터로 설정

![unity-vs-code-integration-1](https://user-images.githubusercontent.com/18159012/42458457-e68d6f8e-83d4-11e8-80f9-eee509f4e6d1.PNG)

# Git 설치

https://git-scm.com/

# .NET SDK 설치

https://www.microsoft.com/net/learn/get-started/windows

다운로드 페이지에 있는, 예제 앱을 실행한 후 정상적으로 SDK를 사용할 수 있다.

##  예제 앱 실행

프롬프트를 열고 다음의 명령어를 입력한다.

```terminal
> dotnet new console -o myApp
> cd myApp
```

해당 명령어를 입력한 디렉토리에 myApp이라는 프로젝트가 생성된다. 생성된 프로젝트를 다음의 명령어를 통해 실행한다.

```terminal
> dotnet run
```

정상적으로 SDK가 설치되었다면 프롬프트에 `Hello World!`라는 콘솔이 뜨게된다. 생성된 myApp 프로젝트는 삭제해도 된다.

# Mono 설치

http://www.mono-project.com/download/stable/

# VS Code C# 플러그인 설치

![unity-vs-code-integration-2](https://user-images.githubusercontent.com/18159012/42458507-f3a29046-83d4-11e8-8a55-7a95eabde89a.png)

# .NET Framework 에러 해결 방법

 Unity가 2018 버전으로 넘어가면서 .NET을 4.X 버전을 기본으로 제공하면서 OmniSharp 콘솔에 다음과 같은 에러 로그가 출력되며 제대로 프로젝트가 로드되지 않을 수 있다. 

![unity-vs-code-integration-3](https://user-images.githubusercontent.com/18159012/49001893-51d8ee00-f1a1-11e8-9c70-b3b0f6e9f1ea.PNG)



VS Code C# 플러그인이 로드될때 4.5버전의 .NET Framework을 찾지 못해서 인데, 비주얼 스튜디오 SDK 사이트에는 4.5버전의 SDK를 지원하지 않는다. 때문에 4.X 의 SDK 중 하나를 골라 다운로드 받은 후 설정 파일에 적용해 주어야 한다.

## .NET Framework SDK 다운로드

https://www.microsoft.com/net/download/visual-studio-sdks

위의 사이트에 접속하면 다운로드 받을 수 있는 .NET Framework SDK를 제공한다. 원하는 버전을 다운로드 한 후 설치하면 SDK 설치를 완료된다. 이후 VS Code에서 Assembly_CSharp.csproj 파일을 열어 `TargetFrameworkVersion`을 설치한 버전으로 변경하면 C# 플러그인이 제대로 로드되게 된다.

![unity-vs-code-integration-4](https://user-images.githubusercontent.com/18159012/49002042-d0ce2680-f1a1-11e8-8981-f079df4eb31a.PNG)
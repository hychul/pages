Android Studio 3.0 이상부터 완벽한 Kotlin 지원을 제공하므로, 손쉽게 기존 프로젝트에 Kotlin 파일을 추가하고 Java 언어 코드를 Kotlin으로 변환할 수 있습니다. 그런 다음, 자동완성, lint 검사기, 리팩터링, 디버깅 등, Kotlin 코드와 함께 Android Studio의 기존 도구를 전부 사용할 수 있습니다. 새 프로젝트를 시작하면서 Kotlin을 사용하려면 프로젝트 생성을 참조하세요.

# Kotlin을 프로젝트에서 사용할 준비

먼저 Kotlin 플러그인을 다운받아야 합니다. **Android Studio > Preferences**을 클릭하고 **Plugins** 탭에서 Kotlin을 검색해 Kotlin 플러그인을 설치합니다.

## 프로젝트 Gradle 설정

프로젝트 `build.gradle` 파일에 다음과 같이 Kotlin 버전과 Kotlin Gradle 플러그인을 추가합니다.

```gradle
buildscript {
    ext.kotlin_version = "1.3.31" // 설치한 Kotlin 플러그인 버전
    repositories {
        google()
        jcenter()
        
    }
    dependencies {
        classpath "com.android.tools.build:gradle:3.4.1"
        classpath "org.jetbrains.kotlin:kotlin-gradle-plugin:$kotlin_version" // Kotlin Gradle 플러그인 추가
        // NOTE: Do not place your application dependencies here; they belong
        // in the individual module build.gradle files
    }
}
```

## 앱 모듈 Gradle 설정

앱 모듈 `build.gradle` 파일에 다음과 같이 Kotlin 관련 설정을 추가합니다.

```gradle
apply plugin: 'com.android.application'
apply plugin: 'kotlin-android' // Kotlin Android 플러그인 적용
apply plugin: 'kotlin-android-extensions' // Kotlin Android Extension 플러그인 적용

...

dependencies {
    ...
    implementation "org.jetbrains.kotlin:kotlin-stdlib-jdk8:$kotlin_version" // Kotlin JDK 버전 설정
}
```

# 기존 프로젝트에 Kotlin 추가

## 새로운 Kotlin 코드 생성

코틀린을 적용하기 이전과 같이 **File > New**를 클릭하고 다양한 Android 템플릿 중 하나를 선택합니다. 이때 나타나는 마법사에서 **Source language**에 **Kotlin**을 선택합니다. 그리고 마법사를 끝까지 진행하면 Kotlin을 앱티비티 클래스로 사용하는 액티비티가 생성됩니다.

액티비티 클래스뿐만 아니라 **File > New > Kotlin File/Class**를 클릭하여 기본 파일을 생성할 수 있습니다. 이 옵션이 보이지 않으면 Project 창을 열고 java 디렉토리를 오른쪽 클릭하여 **New Kotlin File/Class** 옵션을 선택하면 됩니다. 만약 잘못 생성하더라도, 이후에 생성한 파일의 확장자를 Kotlin 확장자인 **.kt** 로 변경하면 Kotlin이 파일 형식을 자동으로 전환하므로 어떤 파일 형식을 선택하든 상관없습니다.

## 기존 Java 코드를 Kotlin 코드로 변환

Java 파일을 열고 **Code > Convert Java File to Kotlin File**을 선택합니다.

또는 새 Kotlin 파일을 생성한 다음(**File > New > Kotlin File/Class**), Java 코드를 그 파일에 붙여넣습니다. 프롬프트가 나타날 때 Yes를 클릭하면 Java 코드를 Kotlin 코드로 변환할 수 있습니다. **Don't show this dialog next time**을 선택하면 Java 코드 스니펫을 Kotlin 파일로 쉽게 덤프할 수 있습니다.

프로젝트에서 Kotlin 및 Java 코드를 모두 사용하는 자세한 방법은 Kotlin과 Java 언어의 상호운용성을 참조하세요.

## Kotlin 코드 소스 디렉토리 나누기

기본적으로, 새 Kotlin 파일은 `src/main/java/`에 저장되고 소스 디렉토리로 지정되어 있다면 Java 코드와 호환되어 동작합니다. 만약 Kotlin 파일과 Java 파일을 따로 저장하고 싶다면 Kotlin 파일을 `src/main/kotlin/`에 저장하고 다음과 같이 앱 모듈의 `build.gradle` 파일의 [sourceSets](https://developer.android.com/studio/build/index.html?hl=ko#sourcesets) 구성에 이 디렉토리를 포함해야 합니다.

```gradle
android {
   sourceSets {
       main.java.srcDirs += 'src/main/kotlin'
   }
}
```

Reference : https://developer.android.com/studio/projects/add-kotlin?hl=ko
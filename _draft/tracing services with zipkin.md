# Zipkin Service

# Service Configuration

## Setup
span 데이터를 zipkin 서비스로 보내기 위한 세팅
```gradle
buildscriptio {
    ext {
        springCloudVersion = 'Finchley.SR2'
        ...
    }
    ...
}

dependencyManagement {
    imports {
        mavenBom "org.springframework.cloud:spring-cloud-dependencies:${springCloudVersion}"
        ...
    }
}

dependencies {
        implementation 'org.springframework.cloud:spring-cloud-starter-zipkin'
        ...
}
```
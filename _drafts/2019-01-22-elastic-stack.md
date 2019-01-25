---
title: Elastic Stack (ELK)
date: 2019-01-22
categories:
- Development
tags:
- Development
- Java
---

![elastic-stack-01](https://user-images.githubusercontent.com/18159012/51519045-230a8b80-1e63-11e9-945b-23388e7bd243.png)

기존 ELK<sup>Elastick-search Logstash Kibana</sup>에 Beats를 추가한 것을 ELK Stack 혹은 Elastic Stack이라고 부른다. 위의 이미지 처럼 Beats를 통해 여러 형태의 정보를 바로 Elasticsearch와 연동하거나 Logstash를 사용하여 분석/변환 과정을 거친후 Elasticsearch에 저장한 후 Kibana를 통해 시각화 한다.

## Elasticsearch

분산형 RESTful 검색 및 분석 엔진. 정형, 비정형, 위치정보, 메트릭 등 원하는 방법으로 다양한 유형의 검색을 수행하고 결합할 수 있다. 표준 RESTful API와 JSON을 사용한다.

1) Near Realtime
- 거의 실시간 검색 플랫폼이라는 특징을 가지고 있습니다.

2) Cluster

- 전체 데이터를 함계 보유하고 모든 노드에서 연합 인덱싱 및 검색 기능을 제공하는 하나 이상의 노드모음입니다.
- 기본적으로 'elasticsearch' 라는 고유한 이름으로 식별합니다.

3) Node

- 클러스터의 일부이며 데이터를 저장하고 클러스터의 인덱싱 및 검색 기능에 참여하는 단일 서버입니다.
- 노드에 할당되는 임의 UUID인 이름으로 식별합니다.
- 특정 클러스터를 클러스터 이름으로 결합하도록 노드를 구성 할 수 있습니다.

4) Index

- 다소 유사한 특성을 갖는 문서들의 집합입니다.
- 단일 클러스터에서 원하는만큼의 인덱스를 정의 할 수 있습니다.

5) Type

- Index 내에서 하나 이상의 Type을 정의 할 수 있습니다.

6) Document

- Index를 생성 할 수 있는 기본 정보 단위입니다.
- JSON으로 표현합니다.

7) Shards

- Index는 잠재적으로 단일 노드의 하드웨어 제한을 초과 할 수 있는 많은 양의 데이터를 저장 할 수 있습니다. 하지만 단일 노드의 디스크가 맞지 않거나 단일 노드의 검색 요청만 처리하기에는 너무 느릴 수 있기 때문에 shards를 이용하여 Index를 여러 조각으로 나눌 수 있습니다. 
- 수평적으로 콘텐츠 볼륨을 split/scale 가능합니다.
- 여러 노드에서 잠재적으로 분산을 통해 작업을 분산 및 병렬 처리를 할 수 있으므로 성능/처리량이 향상됩니다.

8) Replication

- 장애가 발생할 경우 고가용성을 제공합니다. 그렇기 때문에 복제본 샤드는 복사된 원본/기본 샤드와 동일한 노드에 할당되지 않습니다.
- 모든 복제본에서 검색을 병렬로 실행할 수 있기 때문에 검색 볼륨/처리량을 수평 확장 할 수 있습니다.
- 기본적으로 각 인덱스는 4개의 기본 샤드와 1개의 복제본이 할당됩니다.

## Logstash

오픈소스 서버측 데이터 처리 파이프라인으로, 다양한 소스에서 동시에 데이터를 수집하고 변환하여 자주 사용하는 Stash 보관소로 보냅니다.

1) input
- 입력을 사용하여 Logstash에 데이터를 가져옵니다.
- file, syslog(RFC3164 형식), beats(Filebeat)

2) filter

- Logstash 파이프 라인의 중간 처리 장치입니다.
  ① grok : 구문 분석 및 임의의 텍스트로 구성합니다.
  ② mutate : 이벤트 필드에서 일반적인 변환을 수행합니다.
  ③ drop : 이벤트를 삭제합니다.
  ④ clone : 이벤트의 복사본을 만듭니다.
  ⑤ geoip : ip 주소의 지리적 위치에 대한 정보를 추가합니다.

3) output

- Logstash 파이프 라인의 최종 단계입니다.
  ① elasticsearch : 이벤트 데이터를 elasticsearch에 보냅니다.
  ② file : 디스크 파일에 씁니다.
  ③ graphite : graphite에 전송합니다. (graphite : 메트릭을 저장하고 그래프로 작성하는데 사용되는 오픈 소스 도구)
  ④ statsd : 카운터 및 타이머와 같은 통계르 수신하고 UDP를 통해 전송되며, 하나 이상의 플러그 가능한 백엔드 서비스에 집계를 보내는 서비스입니다.

4) codec

- 입력 또는 출력의 일부로 작동 할 수 있는 스트림 필터입니다.
- 인기 코덱에는 json, msgpack, plain이 있습니다.
  ① json : JSON 형식의 데이터를 인코딩하거나 디코딩합니다.
  ② multiline : 자바 예외 및 스택 추척 메시지와 같은 여러 줄 텍스트 이벤트를 단일 이벤트로 병합합니다.



## Beats

서버에 에이전트로 설치하여 다양한 유형의 데이터를 Elastic Search 또는 Logstash에 전송하는 오픈 소스 데이터 발송자입니다. 

1) FileBeat
- 서버에서 로그파일을 제공합니다.

2) PacketBeat

- 응용 프로그램 서버간에 교환되는 트랜잭션에 대한 정보를 제공하는 네트워크 패킷 분석기 입니다.

3) MetricBeat

- 운영 체제 및 서비스에서 Metrics를 주기적으로 수집하는 서버 모니터링 에이전트입니다.

4) WinlogBeat

- Windows 이벤트 로그를 제공합니다.

## Kibana

데이터를 시각적으로 탐색하고 실시간으로 분석 할 수 있습니다.


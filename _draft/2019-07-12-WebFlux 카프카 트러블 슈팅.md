카프카 내부 동작

스프링 카프카의 동작

웹플럭스의 비동기 동작

동기와 비동기 혼합 코드

block() 에서의 문제점 : 버그

rector-kafka의 동작과 한계

다른 서비스와의 throughput 한계

GG

# create ldbasic.repo
$ sudoedit /etc/yum.repos.d/ldbasic.repo
i[ldbasic]
name=CentOS - ldbasic
baseurl=http://oishisoo:QEoAuJ6n@dev3-yum-local.linecorp-beta.com/yum/livedoor/centos$releasever/$basearch/
gpgcheck=0
enabled=0
priority=1
exclude=openssh*

[ldnoarch]
name=CentOS - ldnoarch
baseurl=http://oishisoo:QEoAuJ6n@dev3-yum-local.linecorp-beta.com/yum/livedoor/centos$releasever/noarch/
gpgcheck=0
enabled=0
priority=1
$ sudo yum --enablerepo=ldbasic install line-fluentd
$ sudo /etc/init.d/line-fluentd start


8245
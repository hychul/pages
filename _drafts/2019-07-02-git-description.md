Git을 사용할때 프로젝트의 기능, 스펙 등에 따라 브랜치를 나눠서 작업합니다. 때문에 브랜치 명은 명로하게 설정하는게 좋지만, 한 두개의 단어만으론 설명이 부족한 경우가 있어 브랜치의 설명을 보여줄 수 있으면 좋겠다는 생각을 했습니다.

다행히 Git에서는 브랜치의 설명을 추가하기 위한 `git branch --edit-description` 이라는 옵션을 지원합니다. vim으로 브랜치 설명을 수정할 수 있습니다. 커맨드 라인에서 한줄 짜리 브랜치 설명을 수정하려고 할 땐 `git config branch.<branch name>.description "branch description"` 명령어를 사용할 수 있습니다.

수정한 설명을 보기 위해선 `git config branch.<branch name>.dexcription` 명령어를 사용하면 됩니다.

한가지 아쉬운 점은 `git branch` 명령어에서 어떠한 옵션으로도 브랜치 명과 설명을 동기에 보여주지 않는다는 것입니다. 때문에 간단히 alias에 함수를 추가해서 브랜치 명과 설명을 동시에 보여줄 수 있는 간단한 코드를 작성했습니다.

```shell
function git-branch() {
    if [ $# -lt 1 ]; then
        branch=""
        branches=`git branch --list`
        while read -r branch; do
            clean_branch_name=${branch//\*\ /}
            description=`git config branch.$clean_branch_name.description`
            printf "%-15s %s\n" "$branch" "$description"
        done <<< "$branches"
    elif [ $# -lt 2 ]; then
        branch_name=$1
        git config branch.${branch_name}.description
    else
        branch_name=$1
        desc=$2
        git config branch.${branch_name}.description "${desc}"
    fi
}

```

위 코드를 alias 파일에 추가하는 것으로 `git-branch` 명령어를 통해 브랜치 명과 설명이 동시에 보여질 수 있습니다.
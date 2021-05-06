<!-- https://www.christianengvall.se/undo-pushed-merge-git/ -->
How to undo a merge that has been pushed to origin? Use Revert. After merging my develop branch into the master branch i realized i didn’t want to release the code i just merged. But it was already pushed to origin. What do do?

Update: I’ve made an easy extension to git that makes this command more easy to remember, i call it gitUndo. With that extension all you need run is: git undo pushed-merge <merge-commit-hash>.

first checkout the master branch:

git checkout master
then run a git log and get the id of the merge commit.

git log
then revert to that commit:

git revert -m 1 <merge-commit>
With ‘-m 1’ we tell git to revert to the first parent of the mergecommit on the master branch. -m 2 would specify to revert to the first parent on the develop branch where the merge came from initially.

Now commit the revert and push changes to the remote repo and you are done.

Getting back the reverted changes
This changes the data to look like before the merge, but not the history. So it’s not exactly like an undo. If we would merge develop into master again the changes we reverted in master wont be applied. So if we would like these changes back again we could revert our first revert(!).

git revert <commit-of-first-revert>
To get more information about this check out the git revert documentation or read Linus Torvalds explanation of this behavior
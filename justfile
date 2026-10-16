default:
  @just -l

@add-worktree branch *FLAGS="":
  git worktree add ../potentiel.worktrees/{{branch}} {{FLAGS}} {{branch}}
  cd ../potentiel.worktrees/{{branch}}

@dump-prod:
  pushd ../dump_prod && ./dump_prod.sh &&  popd

@prune-branches:
  git remote prune origin && git branch -vv | grep 'origin/.*: gone]' | awk '{print $1}' | grep -v '^+' | xargs git branch -D

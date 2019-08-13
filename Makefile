create-release-branch:
	git checkout -b release-$(version) develop
merge-release:
	git checkout $(branch) && \
	git pull origin $(branch) && \
	git merge --no-ff release-$(version) -m 'Merge release-$(version) into $(branch).' && \
	git push origin $(branch)
set-version:
	echo 'Generating build...' && \
	npm run build && \
	git add dist && \
	echo 'Setting version to $(version)...' && \
	npx json -I -f package.json -e 'this.version="$(version)"' && \
	npx json -I -f package-lock.json -e 'this.version="$(version)"' && \
	git add package.json && \
	git add package-lock.json && \
	git commit -m 'Upgraded version to $(version)'
create-tag:
	git checkout $(branch) && \
	git tag -a $(version) -m '$(version)' && \
	git push origin $(version)
create-release:
	make version=$(version) create-release-branch && \
	make version=$(version) set-version && \
	make version=$(version) branch=master merge-release && \
	make version=$(version) branch=master create-tag && \
	npm publish && \
	make version=$(version) branch=develop merge-release && \
	git branch -d release-$(version)

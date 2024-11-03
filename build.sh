docker image build --pull --file './Dockerfile' --tag 'fileserverfrontend:latest' --label 'com.microsoft.created-by=visual-studio-code' --platform 'linux/amd64' './'
az acr login --name rbcs399registry
docker tag fileserverfrontend rbcs399registry.azurecr.io/fileserverfrontend:latest
docker push rbcs399registry.azurecr.io/fileserverfrontend:latest
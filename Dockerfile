# docker build -t proxy .
# docker run --name test -p 80:80 -d -v $(pwd)/apps/news/dist-www:/usr/share/nginx/html:ro -w /usr/share/nginx/html proxy

# ARG API_URL=localhostme

FROM nginx@sha256:aa0afebbb3cfa473099a62c4b32e9b3fb73ed23f2a75a65ce1d4b4f55a5c2ef2 as base


###############################
# Dev
FROM base as development

COPY nginx.conf /etc/nginx/nginx.conf

RUN sed -i "s@APIURL@http://host.docker.internal:3002@g" /etc/nginx/nginx.conf

CMD ["nginx", "-g", "daemon off;"]

###############################
# Production
FROM base as production

COPY nginx.conf /etc/nginx/nginx.conf

RUN sed -i "s@APIURL@http://0.0.0.0:3002@g" /etc/nginx/nginx.conf

CMD ["nginx", "-g", "daemon off;"]

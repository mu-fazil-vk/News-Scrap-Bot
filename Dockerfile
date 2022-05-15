FROM buildkite/puppeteer:latest

RUN apt update
RUN apt-get install -y git
RUN git clone https://github.com/Fazil-vk/News-Scrap-Bot /root/News-Scrap-Bot
WORKDIR /root/News-Scrap-Bot/
RUN npm install supervisor -g
RUN apt install -y libgbm-dev

RUN npm install
CMD ["npm", "start"]

# ベースイメージ
FROM node:20-slim

# 作業ディレクトリの設定
WORKDIR /react-native

# 依存関係のインストール
# node_modulesのキャッシュを利用するため先にコピー
COPY package.json package-lock.json* ./
RUN npm install

# ソースコードのコピー
COPY . .

# ポート番号の指定
EXPOSE 3000

# 開発サーバーの起動
CMD ["npm", "start"]
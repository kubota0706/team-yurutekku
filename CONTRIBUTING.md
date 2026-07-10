# 開発規約ガイド

## プロジェクト構造

```
react-native/
├── app.json
├── package.json
├── tsconfig.json
└── src/
    ├── app/          // 画面コンポーネント
    ├── assets/       // 画像・アイコンなど静的ファイル
    ├── atoms/        // Jotai などの状態管理
    ├── components/   // 再利用可能な UI コンポーネント
    ├── constants/    // 定数定義
    ├── dao/          // Firebase などのデータアクセス層
    ├── hooks/        // カスタムフック
    ├── localize/     // 多言語対応
    ├── mocks/        // テスト・デバッグ用モックデータ
    ├── types/        // TypeScript 型定義
    └── utils/        // 横断的ユーティリティ関数
```

---

# 開発規約

## 1. プレフィックス (Prefix) 一覧

| プレフィックス | 概要 | 用途 |
| --- | --- | --- |
| `feat` | 新機能 | 新機能、スクリプトの新規作成 |
| `update` | アップデート | 既存機能への機能追加・アップグレード |
| `change` | 仕様変更 | 出力仕様やロジックの入れ替えなど |
| `fix` | バグ修正 | バグ修正 |
| `remove` | 削除 | ファイルや機能の削除 |
| `refactor` | リファクタリング | 機能を変えないコードの整理 |
| `docs` | ドキュメント | README等の更新 |
| `chore` | 環境構築 | 設定ファイル、ライブラリ追加 |
| `style` | スタイル | デザイン、画面の実装 |

## 開発フロー

1. **Issue 作成** → 実装する機能や修正内容を Issue として登録
2. **Branch 作成** → Issue に対応するブランチを作成
3. **開発** → ブランチ上で実装・修正を行う
4. **Commit** → 変更をコミット（Issue 番号を含める）
5. **Pull Request 作成** → PR を作成して、コミット内容をリンク
6. **マージ** → Squash merge で PR をマージ

---

## Prefix 使い分けガイド

### Issue（大文字）
Issue タイトルに付与するプレフィックス（大文字）

```
[Feat] 新機能名
[Fix] バグ修正内容
[Update] 機能拡張内容
```

### Branch（大文字）
ブランチ名に付与するプレフィックス（大文字）

```
Feat/feature-name
Fix/bug-name
Update/enhancement-name
```

### Commit Message（小文字）
コミットメッセージに付与するプレフィックス（小文字）

```
feat: 機能内容 #123
fix: 修正内容 #123
update: 拡張内容 #123
```

### Pull Request（大文字）
PR タイトルに付与するプレフィックス（大文字）

```
[Feat] Feature Name
[Fix] Bug Description
```

---

## 2. 命名・記述規則

### Issue

- **形式**: `[Prefix] 概要`
- **ルール**: 
  - Prefix の最初の文字は大文字
  - Prefix の後に半角スペース
  - 概要は簡潔に、実装内容を明確に
- **例**:
  - `[Feat] ユーザープロフィール画面の作成`
  - `[Fix] ログイン時のバリデーション不具合`
  - `[Update] ホーム画面に新機能を追加`

### Branch

- **形式**: `Prefix/機能名`
- **ルール**: 
  - Prefix は大文字（Feat, Fix, Update, etc）
  - 機能名の区切りはハイフン (-)
  - 機能名は小文字のみ
  - Issue 番号は含めない（PR の説明で紐付け）
- **例**:
  - `Feat/user-profile-screen`
  - `Fix/login-validation-bug`
  - `Update/home-screen-enhancement`
- **注意**: Branch は Issue 作成後に作成し、Squash merge でマージされるため、複数コミットがあっても最終的には 1 コミットになります

### Pull Request

- **形式**: `[Prefix] 機能名`
- **ルール**: 
  - Prefix は大文字
  - 説明に `fixes #IssueNumber` を記載（自動クローズ用）
  - 変更内容を body に詳しく記載
  - マージ前に必ずレビュー完了を確認
- **例**:
  - タイトル: `[Feat] User Profile Screen Implementation`
  - Body に記載: `fixes #15`
- **Squash merge**: すべての PR は Squash merge で統合される

### Commit Message

- **形式**: `prefix: 変更内容の要約 #Issue番号`
- **ルール**:
  - prefix は小文字（feat, fix, update, change, remove, refactor, docs, chore, style）
  - `:` の後に半角スペース
  - 末尾に `#Issue番号` を記載
  - 要約は簡潔に、実装内容を明確に
  - 命令形での記述推奨（例：「実装した」ではなく「実装」）
- **例**:
  - `feat: ユーザープロフィール画面の作成 #15`
  - `fix: ログイン画面のバリデーション不具合修正 #22`
  - `refactor: API 通信ロジックの整理 #10`
- **複数行メッセージ**:
  ```
  feat: 新機能の実装 #15
  
  - 詳細な変更点 1
  - 詳細な変更点 2
  ```

### File Name

- **形式**: キャメルケース (`camelCase`)
- **ルール**: 
  - 1 つ目の単語は小文字で始まる
  - 2 つ目以降の単語の頭文字を大文字
  - ハイフンやアンダースコアは使用しない
  - 意味のある名前（機能を表す）
- **例**:
  - `loginScreen.tsx` (画面)
  - `userProfileAtom.ts` (Jotai atom)
  - `useProfileForm.ts` (カスタムフック)
  - `profileRegister.ts` (DAO/API)
  - `firebaseConfig.ts` (設定)
- **フォルダ名**: 
  - `src/app/` (画面コンポーネント)
  - `src/components/` (再利用可能コンポーネント)
  - すべて小文字、複数単語の場合はハイフンで区切る（`src/assets/text/` など）

---

## Prefix 一覧（参考）

| Prefix | 用途 | Issue 例 | Branch 例 | Commit 例 |
| --- | --- | --- | --- | --- |
| `feat` | 新機能追加 | `[Feat] QR code交換システム` | `Feat/qr-code-system` | `feat: QRコード交換機能 #1` |
| `fix` | バグ修正 | `[Fix] ログイン失敗時の処理` | `Fix/login-error-handling` | `fix: ログイン失敗時の処理 #5` |
| `update` | 機能拡張 | `[Update] プロフィール表示項目追加` | `Update/profile-fields` | `update: プロフィール表示項目追加 #12` |
| `change` | 仕様変更 | `[Change] ホーム画面レイアウト変更` | `Change/home-layout` | `change: ホーム画面レイアウト変更 #8` |
| `remove` | 削除 | `[Remove] 不要な設定削除` | `Remove/old-config` | `remove: 不要な設定削除 #3` |
| `refactor` | リファクタ | `[Refactor] API ロジック整理` | `Refactor/api-logic` | `refactor: API ロジック整理 #7` |
| `docs` | ドキュメント | `[Docs] CONTRIBUTING更新` | `Docs/contributing-update` | `docs: CONTRIBUTING更新 #2` |
| `chore` | 環境構築 | `[Chore] Expo更新` | `Chore/expo-upgrade` | `chore: Expo v51へ更新 #4` |
| `style` | スタイル | `[Style] ボタンデザイン実装` | `Style/button-design` | `style: ボタンデザイン実装 #6` |
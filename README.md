# Simple Notes App with React Native and Supabase

This is a simple notes application built with React Native and Supabase.

## 🚀 Project Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/your-repo-name.git
    cd your-repo-name
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up Supabase:**
    - Create a new project on [Supabase](https://supabase.com/).
    - In your Supabase project, go to the **SQL Editor** and run the following script to create the `notes` table and enable Row Level Security (RLS):

      ```sql
      -- Create the notes table
      CREATE TABLE notes (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES auth.users(id) NOT NULL,
        title TEXT NOT NULL,
        content TEXT,
        created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
        updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
      );

      -- Enable Row Level Security
      ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

      -- Policies for notes
      CREATE POLICY "Users can only see their own notes"
        ON notes FOR SELECT
        USING (auth.uid() = user_id);

      CREATE POLICY "Users can insert their own notes"
        ON notes FOR INSERT
        WITH CHECK (auth.uid() = user_id);

      CREATE POLICY "Users can update their own notes"
        ON notes FOR UPDATE
        USING (auth.uid() = user_id);

      CREATE POLICY "Users can delete their own notes"
        ON notes FOR DELETE
        USING (auth.uid() = user_id);
      ```

    - Get your project's **URL** and **anon key** from **Settings > API**.
    - Create a `.env` file in the project root and add your Supabase credentials:

      ```
      EXPO_PUBLIC_SUPABASE_URL=your_supabase_url_here
      EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
      ```

      Note: The `.env` file is included in `.gitignore` to prevent committing sensitive information.

## ▶️ Running the Project Locally

1.  **Start the app:**
    ```bash
    npx expo start
    ```
2.  Follow the instructions in the terminal to run the app on an Android emulator or a physical device.

##  Supabase Schema Details

### `notes` table

| Column      | Type        | Description                                  |
| :---------- | :---------- | :------------------------------------------- |
| `id`        | `UUID`      | Primary key for the note                     |
| `user_id`   | `UUID`      | Foreign key referencing `auth.users(id)`     |
| `title`     | `TEXT`      | The title of the note                        |
| `content`   | `TEXT`      | The content of the note                      |
| `created_at`| `TIMESTAMPTZ`| The date and time the note was created       |
| `updated_at`| `TIMESTAMPTZ`| The date and time the note was last updated  |

## 🔐 Authentication Approach

- The app uses Supabase's built-in authentication for email and password sign-up and sign-in.
- User sessions are persisted using `@react-native-async-storage/async-storage`. When a user reopens the app, their session is automatically restored.
- **Row Level Security (RLS)** is enabled on the `notes` table to ensure that users can only access their own notes. The policies for RLS are defined in the SQL script above.

## 📝 Assumptions and Trade-offs

- **Client-side search:** The search functionality is implemented on the client-side for simplicity. For a larger dataset, a server-side search would be more performant.
- **No offline support:** The app does not handle offline mode. If the device is offline, the app will not be able to fetch, create, edit, or delete notes.
- **Basic UI:** The UI is kept simple and functional to focus on the core features of the application.

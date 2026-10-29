"use client";
import { Button } from "@mui/material";
import { Brand, LinkButton, Icon } from "@/components/ui";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main className="standalone">
      <Brand />
      <div className="standalone-card">
        <Icon name="error" />
        <h1>Ada kendala memuat halaman.</h1>
        <p>Coba kembali atau masuk ulang jika sesi berakhir.</p>
        <div className="flex gap-3 justify-center flex-wrap">
          <Button variant="contained" onClick={reset}>
            Coba lagi
          </Button>
          <LinkButton href="/login" variant="outlined">
            Masuk kembali
          </LinkButton>
        </div>
      </div>
    </main>
  );
}

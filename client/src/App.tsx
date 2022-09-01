import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Button,
  Container,
  FormControl,
  Card,
  CardContent,
  FormLabel,
  FormControlLabel,
  RadioGroup,
  Grid,
  Radio,
  Typography,
  Paper,
  Stack,
  TextField,
  Slider,
} from "@mui/material";

interface Postimerkki {
  id: number;
  merkinNimi: string;
  nimellisarvo: number;
  valuutta: string;
  painosmaara: number;
  taiteilija: string;
  kuvanUrl: string;
}

const App: React.FC = (): React.ReactElement => {
  const formRef = useRef<any>();
  const [postimerkit, setPostimerkit] = useState<any[]>([]);
  const [virhe, setVirhe] = useState<string>("");
  const [msg, setMsg] = useState<string>("");
  const [vuosiRange, setVuosiRange] = useState([1856, 2020]);

  const handleChange = (event: any, newValue: any) => {
    setVuosiRange(newValue);
  };

  const search = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setPostimerkit([]);
    setMsg("");

    const hakusana = formRef.current.hakusana.value;
    const hakukohde = formRef.current.hakukohde.value;
    const alkuvuosi = vuosiRange[0];
    const loppuvuosi = vuosiRange[1];

    if (hakusana.length >= 2) {
      try {
        let url: string = `/api/postimerkit?hakukohde=${hakukohde}&hakusana=${hakusana}&alkuvuosi=${alkuvuosi}&loppuvuosi=${loppuvuosi}`;

        const connection = await fetch(url);

        if (connection.ok) {
          setPostimerkit(await connection.json());
          if (postimerkit.length < 1) {
            setMsg(
              `Hakusanalla ${formRef.current.hakusana.value} ei löytynyt yhtään postimerkkiä`
            );
          }
        } else {
          switch (connection.status) {
            case 400:
              setVirhe("Virheellinen hakusana");
              break;
            default:
              setVirhe("Palvelimella tapahtui odottamaton virhe");
              break;
          }
        }
      } catch (e: any) {
        setVirhe("Palvelimelle ei saada yhteyttä.");
      }
    } else {
      setMsg("Hakusanan on oltava vähintään kaksi merkkiä pitkä");
    }
  };
  useEffect(() => {
    if (formRef.current.hakusana.value) {
      if (postimerkit.length > 40) {
        setMsg(
          "Haulla löytyi yli 40 postimerkkiä, näytetään vain ensimmäiset 40. Ole hyvä ja tarkenna hakua"
        );
      }
    }
  }, [postimerkit]);

  return (
    <Container>
      <Typography variant="h5" sx={{ mb: 1 }}>
        Postimerkkihaku
      </Typography>

      <Paper
        component="form"
        onSubmit={search}
        ref={formRef}
        elevation={2}
        sx={{ p: 2, mb: 2 }}
      >
        <Stack spacing={2}>
          <Grid container spacing={1}>
            <Grid item xs={10}>
              <TextField
                name="hakusana"
                variant="outlined"
                size="small"
                fullWidth={true}
                placeholder="Kirjoita hakusana..."
              />
            </Grid>
            <Grid item xs={2}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth={true}
              >
                Hae
              </Button>
            </Grid>
          </Grid>

          <FormControl>
            <FormLabel>Haun kohde</FormLabel>
            <RadioGroup row name="hakukohde" defaultValue="asiasanat">
              <FormControlLabel
                value="asiasanat"
                control={<Radio />}
                label="Asiasanat"
              />
              <FormControlLabel
                value="merkinNimi"
                control={<Radio />}
                label="Merkin nimi"
              />
              <FormControlLabel
                value="taiteilija"
                control={<Radio />}
                label="Taiteilija"
              />
            </RadioGroup>
          </FormControl>
          <Typography gutterBottom>Vuosirajaus</Typography>
          <Slider
            getAriaLabel={() => "Vuosirajaus"}
            value={vuosiRange}
            onChange={handleChange}
            valueLabelDisplay="auto"
            min={1856}
            max={2020}
            defaultValue={vuosiRange}
          />
        </Stack>
      </Paper>

      {Boolean(virhe) ? (
        <Alert severity="error">{virhe}</Alert>
      ) : (
        <Grid
          container
          spacing={1}
          direction="row"
          justifyContent="center"
          alignItems="center"
        >
          {postimerkit
            .slice(0, 40)
            .map((postimerkki: Postimerkki, idx: number) => {
              return (
                <Grid item xs={3} key={idx}>
                  <Card>
                    <CardContent>
                      {postimerkki?.kuvanUrl ? (
                        <img
                          src={postimerkki?.kuvanUrl}
                          alt={postimerkki?.merkinNimi}
                        ></img>
                      ) : null}
                      <Typography>{`Merkin nimi: ${postimerkki?.merkinNimi}`}</Typography>
                      <Typography>{`Taiteilija: ${postimerkki?.taiteilija}`}</Typography>
                      <Typography>{`Painosmäärä: ${postimerkki?.painosmaara}kpl`}</Typography>
                      <Typography>{`Nimellisarvo: ${postimerkki?.nimellisarvo?.toFixed(
                        2
                      )} ${postimerkki?.valuutta}a`}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          {msg ? (
            <Card sx={{ m: 2, p: 1 }}>
              <Typography variant="h6">{msg}</Typography>
            </Card>
          ) : null}
        </Grid>
      )}
    </Container>
  );
};

export default App;

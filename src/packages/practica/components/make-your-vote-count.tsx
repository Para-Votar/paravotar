import { Typography } from "../../../components/index"
import { useTranslation } from "react-i18next"

export default function MakeYourVoteCount() {
  const { t } = useTranslation()

  return (
    <>
      <Typography tag="h2" variant="h3" className="uppercase">
        {t("practice.make-your-vote-count")}
      </Typography>
      <Typography
        tag="h3"
        variant="h2"
        weight="base"
        className="font-normal mt-4"
      >
        {t("practice.learn-signs")}
      </Typography>
      <div className="mt-8">
        <div className="lg:w-10/12 lg:mx-auto">
          <div className="lg:flex">
            <Typography tag="p" variant="p" className="text-center">
              {t("practice.the-only-valid-sign")} <br />
              <b>{t("practice.your-vote-discarded")}</b>
            </Typography>
          </div>
        </div>
      </div>
    </>
  )
}

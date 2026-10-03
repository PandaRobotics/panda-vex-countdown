# Panda Robotics — Cloudflare Pages

Website deploys from `public/`. Root `/` serves the landing page; `/vex-countdown/` serves the countdown.

Pages Git integration settings:
- Repository: PandaRobotics/panda-vex-countdown
- Production branch: main
- Framework: None
- Build command: exit 0
- Build output directory: public
- Root directory: repository root (leave blank)
- Environment variables: none

Test the generated pages.dev URL before connecting `pandarobotics.edu.vn` through Pages > Custom domains. Disable the existing Facebook redirect when the replacement is ready. Retain unrelated DNS records, including any mail records.

Source of the countdown snapshot: local Live Server project in Downloads/Panda/panda-vex-countdown. Future public countdown updates belong in `public/vex-countdown/`. Private test events are excluded from the published snapshot.

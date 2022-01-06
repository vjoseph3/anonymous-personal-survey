# Anonymous Personal Survey

Anonymous Personal Survey is a web application for collecting survey submissions with anonymous duplicate submission tracking.

## Project Status

This project has been re-invented and is currently being developed for
publication here, having been completed and deployed privately not long
after its inception.

## Installation

Details will be finalized after this repo is complete.

## Use

Participants can access the survey from personalized links, all arriving on the
submission page of the React front end. They can fill in their responses and
click either of two buttons:

-   Submit: send the response to the REST API along with a record of the personalized link from which it was sent.
-   Submit Anonymously: send the response to the REST API, but associate it with a randomly generated personalized link. Return this link to the user for re-submission if desired.

The API keeps track of the submissions from each
link separately, maintaining multiple chronological lists.

To access the results, one must send a post request to the REST API, including
a password property in the JSON request body. If the password is correct, the
API responds with a JSON object where each key indicates an individual
survey link, and the corresponding value is a chronological list of all
submissions from that link.

## Licence

ISC License

Copyright (c) 2021, Joseph Vendryes

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.

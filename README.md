# Anonymous Personal Survey

Anonymous Personal Survey is a web application for collecting survey submissions with anonymous duplicate submission tracking.

## Project Status

Development for this project is currently underway but is due to be completed
within a few weeks at the very most.

## Installation

Details will be finalized after this repo is complete.

## Use

Participants can access the survey from personalized links, all arriving on the
submission page of the React front end. They can fill in their responses and
click the Submit button, repeating the process if they want to re-submit.

Each submission is posted to a REST API as a JSON object along with a record of
the URL from which it was sent. The API keeps track of the submissions from each
URL separately, maintaining a number of chronological lists.

To access the results, one must send a post request to the REST API, including
a password property in the JSON request body. If the password is correct, the
API responds with a JSON list of all the chronological submission lists it has
collected, without including any information about who submitted what.

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


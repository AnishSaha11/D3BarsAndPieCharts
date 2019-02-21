******************** README **********************

For Firefox, the index.html can be run directly with no data read issues.
For Chrome and Safari, it needs to be hosted to subvert file access protection. Do the following:-
1. In terminal, navigate to the /src/ dir
2. Run "python -m SimpleHTTPServer 8000", without quotes.
3. Open browser, and type "localhost:8000" to run the index.html file.
from flask import Flask, request, jsonify
import pandas as pd
import numpy as np

@app.route('/calculate-method1')
def calculate_method1():
    try:
        book = request.args.get('book')
        chapter = int(request.args.get('chapter'))
        time_per_chapter = int(request.args.get('time_per_chapter'))

        # Get total remaining chapters
        book_data = bible_data[bible_data['book'] == book]
        if book_data.empty:
            return jsonify({"error": "Invalid book name"}), 400

        total_chapters = book_data['num_chapters'].values[0]
        remaining_chapters = total_chapters - (chapter - 1)

        # Add chapters in subsequent books
        remaining_chapters += int(
            bible_data[bible_data['book_num'] > book_data['book_num'].values[0]]['num_chapters'].sum()
        )

        # Calculate days
        total_time = remaining_chapters * time_per_chapter
        days = total_time // (24 * 60)

        # Convert to Python int to ensure JSON serialisation
        return jsonify({"days": int(days)})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Method 2: Calculate based on pages
@app.route('/calculate-method2')
def calculate_method2():
    try:
        total_pages = int(request.args.get('total_pages'))
        current_page = int(request.args.get('current_page'))
        time_per_page = int(request.args.get('time_per_page'))

        # Validate inputs
        if current_page > total_pages:
            return jsonify({"error": "Current page cannot exceed total pages"}), 400

        # Calculate remaining pages and time
        remaining_pages = total_pages - current_page
        total_time = remaining_pages * time_per_page
        days = total_time // (24 * 60)
        return jsonify({"days": days})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)

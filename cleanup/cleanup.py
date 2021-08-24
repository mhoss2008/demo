"""
cleanup script
1. Deletes all temp files
2. Runs black on all python files
3. Runs pylint on all python files
"""

import os
import subprocess
import datetime

MODE = "debug"


def main():
    """main function"""
    clear_log()

    for root, dirs, files in os.walk("../", topdown=True):
        """remove all files in the temp folder"""
        if files != [] and "temp" in root:
            for file in files:
                filename = os.path.join(root, file)
                print(filename)
                os.remove(filename)
        elif files != []:
            for file in files:
                if ".py" in file:
                    filename = os.path.join(root, file)
                    print(filename)
                    script_cleanup(filename)


def script_cleanup(filename):
    log(f"filename is {filename}")
    log(f"black output")
    subprocess_out = subprocess.run(["black", filename], capture_output=True, text=True)
    log(str(subprocess_out))
    log(f"pylint output")
    subprocess_out = subprocess.run(
        ["pylint", filename], capture_output=True, text=True
    )
    for line in subprocess_out.stdout.splitlines():
        log(line)
    return ()


def clear_log():
    """clear log file"""
    if MODE == "debug":
        log_line = f"start {str(datetime.date.today())} \n\n"
        with open("meta/log.txt", "w", encoding="UTF-8") as myfile:
            myfile.write(log_line)
    return ()


def log(write_line):
    """write to the log file"""

    write_line = write_line + "\n"
    print(write_line)
    if MODE == "debug":
        with open("meta/log.txt", "a", encoding="UTF-8") as myfile:
            myfile.write(write_line)
    return ()


if __name__ == "__main__":
    main()

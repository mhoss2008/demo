"""template for python scripts"""
from datetime import datetime

MODE = "debug"


def main():
    """main function"""
    clear_log()
    log("this is a test")


def clear_log():
    """clear log file"""
    if MODE == "debug":
        log_line = f"start {str(datetime.today())} \n\n"
        with open("temp/log.txt", "w", encoding="latin-1") as myfile:
            myfile.write(log_line)
    return ()


def log(write_line):
    """write to the log file"""
    if MODE == "debug":
        with open("temp/log.txt", "a", encoding="latin-1") as myfile:
            myfile.write(write_line)
    return ()


if __name__ == "__main__":
    main()
